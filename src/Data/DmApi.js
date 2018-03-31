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

    get(path, params) {
        const url = this.getUrl(path);
        return axios({
            method: 'get',
            timeout: 5000,
            url,
            params
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

    getSurvey() {
        return this.get('survey');
    }

    getResponseOptions({ owner } = {}) {
        return this.get('respondentOptions', { owner });
    }

    getResponses({ owner } = {}) {
        return this.get('responses', { owner });
    }
}