import common from './common';

class DummyLocalStorage {
    constructor() {
        this.map = new Map();
    }

    setItem(key, value) {
        this.map.set(key, value);
    }

    getItem(key) {
        return this.map.get(key);
    }

    removeItem(key) {
        this.map.delete(key);
    }
}

const getStorage = () => {
    try {
        return (typeof window === 'undefined' || !window.localStorage) ? new DummyLocalStorage() : window.localStorage;
    }
    catch(e) {
        return new DummyLocalStorage();
    }
};

export default class LocalStore {
    constructor(key) {
        this.key = key;
        this._storage = getStorage();
        Object.freeze(this);
    }

    store(data) {
        let json;

        try {
            json = JSON.stringify(data);
        }
        catch (e) {
            return;
        }

        try {
            this._storage.setItem(this.key, json);
        }
        catch (e) {
            common.log.error('failed to write to local storage', e.toString());
        }
    }

    fetch() {
        let json;

        try {
            json = this._storage.getItem(this.key);
        }
        catch (e) {
            common.log.error('could not retreive results from local storage', e.toString());
            return null;
        }
        
        let obj;

        try {
            obj = JSON.parse(json);
        }
        catch (e) {
            return null;
        }

        return obj;
    }

    clear() {
        this._storage.removeItem(this.key);
    }
}