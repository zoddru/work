import config from '../../config.broker';
import OAuth from 'oauth';
import axios from 'axios';

const oAuthManager = new OAuth.OAuth(
    config.oAuth.url,
    config.oAuth.url,
    config.oAuth.consumerKey,
    config.oAuth.consumerSecret,
    '1.0',
    config.server.rootUrl + 'callback',
    'HMAC-SHA1'
);

export default class WebServices {
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

    getArea(identifier) {
        return this.get(`areas/${identifier}`)
            .then(result => {
                if (result.error || result.data && result.data.errors && result.data.errors.length || !result.data.area)
                    return { success: false, message: `could not retrieve area ${identifier}` };
                const area = result.data.area;
                area.success = true;
                return area;
            })
            .catch(error => ({ success: false, message: 'error', error }));
    }

    getCurrentUser() {
        return this.get('users/current');
    }

    getCurrentArea() {
        return this.get('users/current')
            .then(result => {
                if (result.error || result.data && result.data.errors && result.data.errors.length || !result.data.user)
                    return { success: false, message: 'not signed in' };
                const organisation = result.data.user.organisation;
                if (!organisation)
                    return { success: false, message: 'no organisation' };
                if (!organisation || !organisation.governs || !organisation.governs.identifier)
                    return { success: false, message: `organisation ${organisation.identifier} does not govern an area` };
                const identifier = organisation.governs.identifier;

                return this.getArea(identifier);
            })
            .catch(error => ({ success: false, message: 'error', error }));
    }
}