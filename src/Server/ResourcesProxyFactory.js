import proxy from 'express-http-proxy';
import url from 'url';

export default function ({pathRegex = /^\/resources/} = {}) {
    return proxy('resources.esd.org.uk', {
        proxyReqPathResolver: req => url.parse(req.originalUrl).path.replace(pathRegex, '')
    });
}