class FilterKey {
    constructor(type, item) {
        const { identifier, organisation } = item;
        Object.assign(this, { item, identifier, organisation, type });
        Object.defineProperty(this, 'label', {
            enumerable: true,
            get: function () { return this.fullLabel; }
        });
        Object.freeze(this);
    }

    get key() {
        if (this.identifier === 'default')
            return this.type;
        return `${this.type}-${this.identifier}`;
    }

    get fullLabel() {
        const { type, item, organisation } = this;
        const { label } = item;

        if (type === 'role' || type === 'department')
            return !organisation
                ? `${label} colleagues`
                : `${label} colleagues in ${organisation.shortLabel || organisation.label}`;

        if (type === 'organisation' || type === 'areaGroup')
            return `Colleagues in ${item.shortLabel || item.label}`;

        return label;
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

class Filter {
    constructor({ key, local, filter }) {
        Object.assign(this, { key, local, filter });
        Object.freeze(this);
    }

    get value() {
        return this.key.key;
    }

    get type() {
        return this.key.type;
    }

    get label() {
        return this.key.label;
    }
}

const createOrganisationFilter = (organisation) => {
    if (!organisation || !organisation.identifier)
        return null;
    return new Filter({
        key: new FilterKey('organisation', { identifier: 'default', label: organisation.shortLabel || organisation.label }),
        local: true,
        filter: v => v.respondent.organisation === organisation.identifier
    });
};

const createOrganisationFilters = ({ organisation, roles, departments }) => {
    if (!organisation || !organisation.identifier)
        return [];

    const orgFilter = createOrganisationFilter(organisation);

    return [orgFilter].concat(
        roles.map(r => new Filter({
            key: new FilterKey('role', { identifier: r.identifier, label: `${r.label}`, organisation }),
            local: true,
            filter: v => v.respondent.organisation === organisation.identifier && v.respondent.role === r.identifier
        }))
    ).concat(
        departments.map(d => new Filter({
            key: new FilterKey('department', { identifier: d.identifier, label: `${d.label}`, organisation }),
            local: true,
            filter: v => v.respondent.organisation === organisation.identifier && v.respondent.department === d.identifier
        }))
    );
};

export default Object.freeze({

    createOrganisationFilter,

    create: ({ respondent, organisation, departments, roles, areaGroups }) => {
        const { department, role } = respondent || { department: {}, role: {} };

        const filters = [new Filter({
            key: new FilterKey('respondent', { identifier: 'default', label: 'My score' }),
            local: true,
            filter: v => v.respondent.identifier === respondent.identifier
        })]
            .concat(createOrganisationFilters({ organisation, roles, departments }))
            .concat(
                areaGroups.map(ag => new Filter({
                    key: new FilterKey('areaGroup', ag),
                    local: false,
                    filter: v => ag.members.filter(m => m.identifier === v.respondent.area)
                }))
            );

        filters.sort((a, b) => a.label < b.label ? -1 : 1);

        return filters;
    }
});