require('dotenv').config();
const config = require('../config.broker');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
import AuthenticationActions from './Server/AuthenticationActions';
import DataMaturityActions from './Server/DataMaturityActions';
import CsvWriter from './CsvWriter';
import OAuthAccessor from './Server/OAuthAccessor';
import WebServices from './Data/WebServices';
const dmApiProxy = require(`./Server/${config.useLocal ? 'LocalDmApiProxyFactory' : 'DmApiProxyFactory'}`).default();
const webservicesProxy = require('./Server/OAuthWebServicesProxyFactory').default();
const resourcesProxy = require('./Server/ResourcesProxyFactory').default();

const port = config.server.port;

const app = express()
    .use(cookieParser())
    .use(session({ secret: 'saint seiya vs gatchaman', cookie: { maxAge: 6000000 } }))
    .use('/dmApi/*', dmApiProxy)
    .use('/webservices/*', webservicesProxy)
    .use('/resources/*', resourcesProxy)
    .use(bodyParser.json())

    // data maturity
    .get('/', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/result', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/questions', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/organisation', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/disclaimer', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/table', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))
    .get('/chart', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))

    .get('/test-*', (req, res) => res.sendFile('dataMaturity.html', { root: './docs' }))

    .get('/dataMaturity.html', (req, res) => res.redirect('/'))
    .get('/dataMaturity.result.html', (req, res) => res.redirect('/result'))

    .put('/data/save/area', DataMaturityActions.saveCurrentArea)
    .put('/data/save/area/:identifier', DataMaturityActions.saveArea)

    .get('/data/scores', DataMaturityActions.scores)
    .get('/data/currentResponseOptions', DataMaturityActions.currentResponseOptions)

    .post('/error', DataMaturityActions.error)

    // authentication:
    .get('/authentication/status', AuthenticationActions.status)
    .get('/authentication/log', AuthenticationActions.log)
    .get('/signin', AuthenticationActions.signIn)
    .get('/signout', AuthenticationActions.signOut)
    .get('/callback', AuthenticationActions.callback)

    .get('/hello', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send({ message: 'hello world' });
    })

    .get('/secret', (req, res) => {
        const _process$env = process.env,
            configName = _process$env.configName,
            testString = _process$env.testString;

        res.setHeader('Content-Type', 'application/json');
        res.send({
            process: {
                env: process.env
            }
        });
    })

    // misc:
    .post('/csv', (req, res) => {
        const table = req.body;

        const csv = new CsvWriter().write(table);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');

        res.write(csv);

        res.end();
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

    .use(express.static('docs'))

    .listen(port, () => console.log('listening on port ' + port));