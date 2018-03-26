const config = require('../config.broker');
const OAuth = require('oauth');
const axios = require('axios');

const oAuthManager = new OAuth.OAuth(
    config.oAuth.url,
    config.oAuth.url,
    config.oAuth.consumerKey,
    config.oAuth.consumerSecret,
    '1.0',
    config.server.rootUrl + 'callback',
    'HMAC-SHA1'
);

class WebServices {
    constructor({ token, secret }) {
        this.root = config.webservices.root;
        this.token = token;
        this.secret = secret;
        Object.freeze(this);
    }

    signUrl(path) {
        return oAuthManager.signUrl(`${this.root}${path}`, this.token, this.secret);
    }

    get(path) {
        const url = this.signUrl(path);
        return axios({
            method: 'get',
            timeout: 5000,
            url: url
        });
    }

    getCurrentUser() {
        return this.get('users/current');
    }

    getCurrentArea() {
        return new Promise(this.get('users/current'))
            .then(result => {
                if (result.error || result.data && result.data.errors && result.data.errors.length) {
                    return { message: 'not signed in' };
                }
                const data = result.data;
                if (!data.user || !data.user.organisation || !data.user.organisation.governs || !data.user.organisation.governs.identifier) {
                    return { message: 'no current area' };
                }
                const identifier = data.user.organisation.governs.identifier;
                
                return { identifier };
            });
    }
}

module.exports = WebServices;