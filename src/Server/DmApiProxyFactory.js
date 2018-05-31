const config = require('../../config.broker');
import proxy from 'express-http-proxy';
import url from 'url';
import DmApi from '../Data/DmApi';

const dmApiHost = DmApi.host;
const dmApiScheme = (DmApi.scheme || 'HTTPS').toUpperCase();

export default function ({pathRegex = /^\/dmApi/} = {}) {
    return proxy(dmApiHost, {
        https: 'HTTPS' === dmApiScheme,
        proxyReqPathResolver: req => url.parse(req.originalUrl).path.replace(pathRegex, '')
    });
}