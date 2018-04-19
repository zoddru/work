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
        
    const { identifier, type, label, organisation } = item;

    if (!organisation)
        return { identifier, type, label };

    return {
        identifier,
        type,
        label,
        organisation: {
            identifier: organisation.identifier,
            label: organisation.label,
            shortLabel: organisation.shortLabel
        }
    };
};

export default class ScoreKey {
    constructor({ category, filter }) {

        Object.assign(this, {
            category: simplify(Object.assign({}, defaultCategory, category)),
            filter: simplify(Object.assign({}, defaultFilter, filter))
        });

        Object.freeze(this);
    }

    get identifier() {
        const { category, filter } = this;
        return `${category.identifier}-${filter.identifier}-${filter.type}`;
    }

    get filterType() {
        const { filter = filter || defaultFilter } = this;
        return filter.type;
    }

    get filterLabel() {
        const { filter = filter || defaultFilter } = this;
        return filter.label;
    }

    get filterOrganisation() {
        const { filter = filter || defaultFilter } = this;
        return filter.organisation;
    }

    get label() {
        const { filterLabel } = this;
        return filterLabel;
    }

    toString() {
        return this.identifier;
    }
}