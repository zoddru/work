const config = require('../../config.broker');
const axios = require('axios');

const host = config.dataMaturity && config.dataMaturity.apiHost || 'api.dataMaturity.esd.org.uk';

export default class DmApi {
    constructor({ scheme = 'http' } = {}) {
        this.scheme = scheme;
        Object.freeze(this);
    }

    static get host() {
        return host;
    }

    getUrl(path) {
        const scheme = this.scheme;
        return `${scheme}://${host}/${path}`;
    }

    get(path) {
        const url = this.getUrl(path);
        return axios({
            method: 'get',
            timeout: 5000,
            url: url
        });
    }

    put(path, data) {
        const url = this.getUrl(path);
        return axios({
            method: 'put',
            timeout: 5000,
            url,
            data
        });
    }

    putArea(area) {
        return this.put('area', area);
    }
}