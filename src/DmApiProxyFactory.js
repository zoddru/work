const config = require('../config.broker');
import proxy from 'express-http-proxy';
import url from 'url';
import DmApi from './DmApi';

const dmApiHost = DmApi.host;

export default function ({pathRegex = /^\/dmApi/} = {}) {
    return proxy(dmApiHost, {
        proxyReqPathResolver: req => url.parse(req.originalUrl).path.replace(pathRegex, '')
    });
}