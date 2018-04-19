import axios from 'axios';
import React from 'react';

const global = Object.freeze({
    set: (name, value) => {
        if (typeof window === 'undefined')
            return;
        window.global = window.global || {};
        window.global[name] = value;
    },

    get: (name) => {
        if (typeof window === 'undefined' || !window.global)
            return null;
        return window.global[name] || null;
    }
});

const common = Object.freeze({
    version: 'Beta 1.0.1',

    toSelectOptions: items => items.map(item => { return { value: item.identifier, label: item.label } }).sort(item => item.label),

    log: Object.freeze({
        error: (error, info) => {
            const data = {
                message: error && error.toString() || 'unknown'
            };

            const infoMessage = info && info.componentStack && info.componentStack.toString() || false;

            if (infoMessage) {
                data.info = infoMessage;
            }

            const authStatus = global.get('authStatus', authStatus);
            
            if (authStatus && authStatus.isSignedIn) {
                data.userIdentifier = authStatus.user.identifier;
            }

            return axios.post('/error', data);
        }
    }),

    parseText: (text) => {
        const lines = text.split(/\n/);
        return lines.map((l, i) => <p key={i}>{l}</p>);
    },

    global
});

export default common;