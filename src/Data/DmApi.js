const config = require('../../config.broker');
const axios = require('axios');
const timeout = 10000;

const host = config.dataMaturity && config.dataMaturity.apiHost || 'api.dataMaturity.esd.org.uk';
const scheme = config.dataMaturity && config.dataMaturity.apiScheme || 'https';

export default class DmApi {
    constructor() {
        this.scheme = scheme;
        Object.freeze(this);
    }

    static get host() {
        return host;
    }

    static get scheme() {
        return scheme;
    }

    getUrl(path) {
        const scheme = this.scheme;
        return `${scheme}://${host}/${path}`;
    }

    get(path, params) {
        const url = this.getUrl(path);
        return axios({
            method: 'get',
            timeout,
            url,
            params
        });
    }

    post(path, data) {
        const url = this.getUrl(path);
        return axios({
            method: 'post',
            timeout,
            url,
            data
        });
    }

    put(path, data) {
        const url = this.getUrl(path);
        return axios({
            method: 'put',
            timeout,
            url,
            data
        });
    }

    putArea(area) {
        return this.put('area', area);
    }

    postError(data) {
        return this.post('error', data);
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