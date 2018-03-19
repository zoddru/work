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

export default class LocalStore {
    constructor(key) {
        this.key = key;
        this._storage = (typeof window === 'undefined' || !window.localStorage) ? new DummyLocalStorage() : window.localStorage;
        Object.freeze(this);
    }

    store(data) {
        let json;
        
        try {
            json = JSON.stringify(data);
        }
        catch(e) {
            return;
        }

        this._storage.setItem(this.key, json);
    }

    fetch() {
        const json = this._storage.getItem(this.key);
        let obj;
        
        try {
            obj = JSON.parse(json);
        }
        catch(e) {
            return null;
        }

        return obj;
    }

    clear() {
        this._storage.removeItem(this.key);
    }
}