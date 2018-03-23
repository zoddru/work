require('dotenv').config();
const config = require('../config.broker');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const urlParser = require('url');
const OAuth = require('oauth');
import CsvWriter from './CsvWriter';
import OAuthAccessor from './OAuthAccessor';
import WebServices from './WebServices';

const dmApiProxy = require(config.useLocal ? './LocalDmApiProxyFactory' : './DmApiProxyFactory').default();
const webservicesProxy = require('./OAuthWebServicesProxyFactory').default();

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

const port = config.server.port;

const app = express()
    .use(cookieParser())
    .use(session({ secret: 'saint seiya vs gatchaman', cookie: { maxAge: 6000000 } }))
    .use('/dmApi/*', dmApiProxy)
    .use('/webservices/*', webservicesProxy)
    .use(bodyParser.json())
    
    .get('/', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/result', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/questions', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/organisation', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/table', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/chart', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))

    .get('/test-*', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))

    .get('/dataMaturity.html', (req, res) => res.redirect('/'))
    .get('/dataMaturity.result.html', (req, res) => res.redirect('/result'))

    .get('/authentication/status', (req, res) => {

        if (config.useLocal) {
            res.send(JSON.stringify({ isSignedIn: false, usingLocal: true }));
            return;
        }

        const oAuthAccessor = new OAuthAccessor(req, res);
        const oAuth = oAuthAccessor.get();
        res.setHeader('Content-Type', 'application/json');

        if (!oAuth || !oAuth.token || !oAuth.secret) {
            res.send(JSON.stringify({ isSignedIn: false }));
            return;
        }

        new WebServices(oAuth)
            .getCurrentUser()
            .then(result => {
                if (result.error || result.data && result.data.errors && result.data.errors.length) {
                    oAuthAccessor.set(null); // assume this data is now invalid
                    res.send(JSON.stringify({ isSignedIn: false, error: result.error || result.data.errors }));
                }
                else {
                    res.send(JSON.stringify({ isSignedIn: true, user: result.data.user }));
                }
            })
            .catch(error => {
                res.send(JSON.stringify({ isSignedIn: false, error: error.message }));
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

            new OAuthAccessor(req, res).set({ token, secret });
            const authURL = `${config.oAuth.url}?oauth_token=${token}`;

            res.redirect(`${authURL}`);
        });
    })

    .get('/signout', (req, res) => {
        const rootUrl = getRootUrl(req);
        const urlObj = urlParser.parse(req.url, true);
        const returnUrl = urlObj.query.returnUrl || rootUrl;
        const encodedUrl = encodeURIComponent(returnUrl);

        new OAuthAccessor(req, res).set(null); // assume this data is now invalid
        res.redirect(`${config.oAuth.signOutUrl}?returnUrl=${encodedUrl}`);
    })

    .get('/callback', (req, res) => {
        const rootUrl = getRootUrl(req);
        const urlObj = urlParser.parse(req.url, true);
        const returnUrl = urlObj.query.returnUrl || rootUrl;
        const oAuthAccessor = new OAuthAccessor(req, res);
        const oAuthDetails = oAuthAccessor.get(); 

        if (!oAuthDetails) {
            console.log('no oAuth object found in session');
            res.redirect(rootUrl);
            return;
        }

        getOAuthManager().getOAuthAccessToken(
            urlObj.query.oauth_token,
            oAuthDetails.secret,
            urlObj.query.oauth_verifier,
            (error, token, secret, results) => {
                oAuthAccessor.set({ token, secret });
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

    .get(/data\/(.+)/, (req, res) => {
        const path = req.params[0];
        res.setHeader('Content-Type', 'application/json');

        const oAuth = new OAuthAccessor(req, res).get() || {};
        new WebServices(oAuth)
            .get(path)
            .then(result => {
                res.send(JSON.stringify(result.data));
            })
            .catch(error => {
                res.send(JSON.stringify({ error: true, message: error.message, stack: error.stack }));
            });
    })

    .get('/secretConfig', (req, res) => {
        const { configName, testString } = process.env;

        res.setHeader('Content-Type', 'application/json');
        res.send({
            process: {
                env: { configName, testString }
            }
        });
    })

    .use(express.static('docs'))

    .listen(port, () => console.log('listening on port ' + port));