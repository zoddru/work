const config = require('./config');
const http = require('http');
const urlParser = require('url');
const OAuth = require('oauth');
const WebServices = require('./src/WebServices');
const util = require('util');

const express = require('express');
const session = require('express-session');

const oAuthManager = new OAuth.OAuth(
    config.oAuth.url,
    config.oAuth.url,
    config.oAuth.consumerKey,
    config.oAuth.consumerSecret,
    '1.0',
    config.server.rootUrl + 'callback',
    'HMAC-SHA1'
);

const port = config.server.port;

const app = express()

    .use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))

    .get('/', (req, res) => {
        res.sendFile('index.html', {
            root: __dirname + '\\dist'
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
        const url = urlParser.parse(req.url, true);

        oAuthManager.getOAuthRequestToken(function (error, token, secret, results) {
            if (error && error.data) {
                res.setHeader('Content-Type', 'text/html');
                res.send(error.data);
                return;
            }

            req.session.oAuth = { token, secret };
            const authURL = config.oAuth.url + '?oauth_token=' + token;
            res.redirect(authURL);
        });
    })

    .get('/signout', (req, res) => {        
        const rootUrl = req.protocol + '://' + req.get('host');
        const encodedUrl = encodeURIComponent(rootUrl);
        req.session.oAuth = null; // assume this data is now invalid
        res.redirect(`${config.oAuth.signOutUrl}?returnUrl=${encodedUrl}`);
    })

    .get('/callback', (req, res) => {
        const rootUrl = req.protocol + '://' + req.get('host');
        const urlObj = urlParser.parse(req.url, true);

        if (!req.session.oAuth) {
            console.log('no oAuth object found in session');
            res.redirect(rootUrl);
            return;
        }

        oAuthManager.getOAuthAccessToken(
            urlObj.query.oauth_token,
            req.session.oAuth.secret,
            urlObj.query.oauth_verifier,
            (error, token, secret, results) => {
                req.session.oAuth = { token, secret };
                const rootUrl = req.protocol + '://' + req.get('host');
                res.redirect(rootUrl);
            });
    })

    .get('/wait/:time', (req, res) => {
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
        
        new WebServices(req.session.oAuth || {})
            .get(path)
            .then(result => {
                res.send(JSON.stringify(result.data));
            })
            .catch(error => {
                res.send(JSON.stringify({ error: true, message: error.message, stack: error.stack }));
            });
    })

    .use(express.static('dist'))

    .listen(port, () => console.log('listening on port ' + port));