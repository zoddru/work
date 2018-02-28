const config = require('../config.broker');
import http from 'http';
const urlParser = require('url');
const OAuth = require('oauth');
const WebServices = require('./WebServices');
const util = require('util');

const url = require('url');
const express = require('express');
const session = require('express-session');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');

const port = config.server.port;

import CsvWriter from './CsvWriter';

const apiHost = config.dataMaturity && config.dataMaturity.apiHost || 'api.dataMaturity.esd.org.uk';
const apiProxy = proxy(apiHost, {
    proxyReqPathResolver: req => url.parse(req.originalUrl).path.replace(/^\/api/, '')
});

function getOAuthManager(returnUrl) {
    let callback = config.server.rootUrl + 'callback';

    if (returnUrl) {
        callback += `?returnUrl=${returnUrl}`;
    }

    return new OAuth.OAuth(
        config.oAuth.url,
        config.oAuth.url,
        config.oAuth.consumerKey,
        config.oAuth.consumerSecret,
        '1.0',
        callback,
        'HMAC-SHA1'
    );
}

function getRootUrl(req) {
    return req.protocol + '://' + req.get('host');
}

function getFullUrl(req) {
    return getRootUrl(req) + req.originalUrl;
}

const app = express()

    .use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))
    .use('/api/*', apiProxy)
    .use(bodyParser.json())
    
    .get('/', (req, res) => {
        res.sendFile('index.html', {
            root: __dirname + '\\docs'
        });
    })

    .get('/status.json', (req, res) => {
        const oAuth = req.session.oAuth;
        res.setHeader('Content-Type', 'application/json');

        if (!oAuth || !oAuth.token || !oAuth.secret) {
            res.send(JSON.stringify({ isSignedIn: false }));
            return;
        }

        new WebServices(oAuth)
            .getCurrentUser()
            .then(result => {
                if (result.error) {
                    req.session.oAuth = null; // assume this data is now invalid
                    res.send(JSON.stringify({ isSignedIn: false, error: result.error }));
                }
                else {
                    res.send(JSON.stringify({ isSignedIn: true, user: result.data.user }));
                }
            })
            .catch(error => {
                res.send(JSON.stringify({ isSignedIn: false, error }));
            });
    })

    .get('/signin', (req, res) => {
        const urlObj = urlParser.parse(req.url, true);
        const returnUrl = urlObj.query.returnUrl;

        getOAuthManager(returnUrl).getOAuthRequestToken(function (error, token, secret, results) {
            if (error && error.data) {
                res.setHeader('Content-Type', 'text/html');
                res.send(error.data);
                return;
            }

            req.session.oAuth = { token, secret };
            const authURL = `${config.oAuth.url}?oauth_token=${token}`;

            res.redirect(`${authURL}`);
        });
    })

    .get('/signout', (req, res) => {
        const rootUrl = getRootUrl(req);
        const urlObj = urlParser.parse(req.url, true);
        const returnUrl = urlObj.query.returnUrl || rootUrl;
        const encodedUrl = encodeURIComponent(returnUrl);

        req.session.oAuth = null; // assume this data is now invalid
        res.redirect(`${config.oAuth.signOutUrl}?returnUrl=${encodedUrl}`);
    })

    .get('/callback', (req, res) => {
        const rootUrl = getRootUrl(req);
        const urlObj = urlParser.parse(req.url, true);
        const returnUrl = urlObj.query.returnUrl || rootUrl;

        if (!req.session.oAuth) {
            console.log('no oAuth object found in session');
            res.redirect(rootUrl);
            return;
        }

        getOAuthManager().getOAuthAccessToken(
            urlObj.query.oauth_token,
            req.session.oAuth.secret,
            urlObj.query.oauth_verifier,
            (error, token, secret, results) => {
                req.session.oAuth = { token, secret };
                res.redirect(returnUrl);
            });
    })

    .post('/csv', (req, res) => {
        const table = req.body;

        const csv = new CsvWriter().write(table);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');

        res.write(csv);

        res.end();
    })

    .get('/wait/:time*', (req, res) => {
        const time = parseInt(req.params.time);
        const start = Date.now();

        setTimeout(() => {
            const end = Date.now();
            const diff = end - start;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ time, start, end, diff }));
        }, time);
    })

    // .get(/dataMaturity\/api\/(.+)/, (req, res) => {
    //     const path = req.params[0];
    //     const uri = `http://api.dataMaturity.esd.org.uk/${path}`;
    //     const qs = req.query;
    //     //res.setHeader('Content-Type', 'application/json');
    //     //res.send(JSON.stringify({ fullPath }));

    //     req.pipe(request({ qs, uri })).pipe(res);
    // })

    .get(/data\/(.+)/, (req, res) => {
        const path = req.params[0];
        res.setHeader('Content-Type', 'application/json');

        new WebServices(req.session.oAuth || {})
            .get(path)
            .then(result => {
                res.send(JSON.stringify(result.data));
            })
            .catch(error => {
                res.send(JSON.stringify({ error: true, message: error.message, stack: error.stack }));
            });
    })

    .use(express.static('docs'))

    .listen(port, () => console.log('listening on port ' + port));