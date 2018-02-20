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
        console.log(url);
        return axios({
            method: 'get',
            url: url
        });
    }

    getCurrentUser() {
        return this.get('users/current');
    }
}

module.exports = WebServices;