class TypedItem {
    constructor(type, item) {
        Object.assign(this, item, { type });
        Object.freeze(this);
    }

    get key() {
        if (this.type === 'default')
            return this.identifier; 
        return `${this.type}-${this.identifier}`;
    }

    equals(item) {
        if (!item)
            return false;
        return this.type === item.type && this.identifier === item.identifier;
    }
}

export default class ResponseFilters {
    static create({ respondent, organisation, departments, roles, areaGroups }) {
        const { department, role } = respondent || { department: {}, role: {} };
        const org = organisation || { identifier: '', label: '---' };
    
        const filters = [
            {
                key: new TypedItem('default', { identifier: 'respondent', label: 'My score' }),
                local: true,
                filter: v => v.respondent.identifier === respondent.identifier
            },
            {
                key: new TypedItem('default', { identifier: 'organisation', label: org.shortLabel || org.label }),
                local: true,
                filter: v => v.respondent.organisation === org.identifier
            }
        ].concat(
            roles.map(r => ({
                key: new TypedItem('role', r),
                local: true,
                filter: v => v.respondent.organisation === org.identifier && v.respondent.role === r.identifier
            }))
        ).concat(
            departments.map(d => ({
                key: new TypedItem('department', d),
                local: true,
                filter: v => v.respondent.organisation === org.identifier && v.respondent.department === d.identifier
            }))
        ).concat(
            areaGroups.map(ag => ({
                key: new TypedItem('areaGroup', ag),
                local: false,
                filter: v => false
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
}