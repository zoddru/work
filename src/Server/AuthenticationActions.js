import config from '../../config.broker';
import OAuth from 'oauth';
import OAuthAccessor from './OAuthAccessor';
import urlParser from 'url';
import WebServices from '../Data/WebServices';

const getOAuthManager = (returnUrl) => {
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
};

const getRootUrl = (req) => {
    return req.protocol + '://' + req.get('host');
};

export default Object.freeze({
    getOAuthManager,

    signIn: (req, res) => {
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
    },

    signOut: (req, res) => {
        const rootUrl = getRootUrl(req);
        const urlObj = urlParser.parse(req.url, true);
        const returnUrl = urlObj.query.returnUrl || rootUrl;
        const encodedUrl = encodeURIComponent(returnUrl);

        new OAuthAccessor(req, res).set(null); // assume this data is now invalid
        res.redirect(`${config.oAuth.signOutUrl}?returnUrl=${encodedUrl}`);
    },

    callback: (req, res) => {
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
            }
        )
    },

    status: (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        if (config.useLocal) {
            res.send(JSON.stringify({ isSignedIn: false, usingLocal: true }));
            return;
        }

        const oAuthAccessor = new OAuthAccessor(req, res);
        const oAuth = oAuthAccessor.get();

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
    },

    log: (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const oAuthAccessor = new OAuthAccessor(req, res);
        const oAuth = oAuthAccessor.get();

        console.log(JSON.stringify(oAuth));

        res.send({ message: 'check the logs' });
    }
});