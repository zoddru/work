const defaultCategory = {
    identifier: 'default'
};

const defaultFilter = {
    identifier: 'default',
    type: 'default'
};

const simplify = (item) => {
    if (!item)
        return item;
    const { identifier, type, label } = item;
    return { identifier, type, label };
};

export default class ScoreKey {
    constructor({ category, filter }) {
        Object.assign(this, { category: simplify(category), filter: simplify(filter) });
        Object.freeze(this);
    }

    get identifier() {
        const { category = category || defaultCategory, filter = filter || defaultFilter } = this;
        return `${category.identifier}-${filter.identifier}-${filter.type}`;
    }

    get filterType() {
        const { filter = filter || defaultFilter } = this;
        return filter.type;
    }

    get label() {
        return this.filter && this.filter.label;
    }

    toString() {
        return this.identifier;
    }
}