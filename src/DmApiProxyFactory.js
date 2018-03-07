const config = require('../config.broker');
import proxy from 'express-http-proxy';
import OAuth from 'oauth';
import OAuthAccessor from './OAuthAccessor';
import url from 'url';

const dmApiHost = config.dataMaturity && config.dataMaturity.apiHost || 'api.dataMaturity.esd.org.uk';

export default function ({pathRegex = /^\/dmApi/} = {}) {
    return proxy(dmApiHost, {
        proxyReqPathResolver: req => url.parse(req.originalUrl).path.replace(pathRegex, '')
    });
}