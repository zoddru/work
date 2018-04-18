export default class TypedItem {
    constructor(type, item) {
        Object.assign(this, item, { type });
        Object.freeze(this);
    }

    get key() {
        if (this.identifier === 'default')
            return this.type;
        return `${this.type}-${this.identifier}`;
    }

    equals(item) {
        if (!item)
            return false;
        return this.type === item.type && this.identifier === item.identifier;
    }

    toString() {
        return this.key;
    }
}