const config = require('../config.broker');
import proxy from 'express-http-proxy';
import OAuth from 'oauth';
import OAuthAccessor from './OAuthAccessor';
import url from 'url';

const webServicesHost = config.webservices && config.webservices.host || 'webservices.esd.org.uk';

export default function ({pathRegex = /^\/webservices/} = {}) {
    return proxy(webServicesHost, {
        proxyReqPathResolver: req => {
            const path = url.parse(req.originalUrl).path.replace(pathRegex, '');
    
            const oAuthManager = new OAuth.OAuth(
                config.oAuth.url,
                config.oAuth.url,
                config.oAuth.consumerKey,
                config.oAuth.consumerSecret,
                '1.0',
                config.server.rootUrl + 'callback',
                'HMAC-SHA1'
            );
    
            const { token, secret } = new OAuthAccessor(req, {}).get() || {};
            const signedUrl = oAuthManager.signUrl(`http://${webServicesHost}${path}`, token, secret);
            const signedPath = url.parse(signedUrl).path.replace(pathRegex, '');
    
            return signedPath;
        }
    });
}