class TypedItem {
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
}

const createOrganisationFilter = (organisation) => {
    if (!organisation || !organisation.identifier)
        return null;
    return {
        key: new TypedItem('organisation', { identifier: 'default', label: organisation.shortLabel || organisation.label }),
        local: true,
        filter: v => v.respondent.organisation === organisation.identifier
    };
};

const createOrganisationFilters = ({ organisation, roles, departments }) => {
    if (!organisation || !organisation.identifier)
        return [];

    const orgFilter = createOrganisationFilter(organisation);

    return [orgFilter].concat(
        roles.map(r => ({
            key: new TypedItem('role', { identifier: r.identifier, label: `${r.label}` }),
            local: true,
            filter: v => v.respondent.organisation === organisation.identifier && v.respondent.role === r.identifier
        }))
    ).concat(
        departments.map(d => ({
            key: new TypedItem('department', { identifier: d.identifier, label: `${d.label}` }),
            local: true,
            filter: v => v.respondent.organisation === organisation.identifier && v.respondent.department === d.identifier
        }))
    );
};

export default Object.freeze({

    createOrganisationFilter,

    create: ({ respondent, organisation, departments, roles, areaGroups }) => {
        const { department, role } = respondent || { department: {}, role: {} };

        const filters = [{
            key: new TypedItem('respondent', { identifier: 'default', label: 'My score' }),
            local: true,
            filter: v => v.respondent.identifier === respondent.identifier
        }]
            .concat(createOrganisationFilters({ organisation, roles, departments }))
            .concat(
                areaGroups.map(ag => ({
                    key: new TypedItem('areaGroup', ag),
                    local: false,
                    filter: v => ag.members.filter(m => m.identifier === v.respondent.area)
                }))
            );

        filters.forEach(f => {
            f.value = f.key.key;
            f.type = f.key.type;
            f.label = f.key.label;
        });

        filters.sort((a, b) => a.label < b.label ? -1 : 1);

        return filters;
    }
});