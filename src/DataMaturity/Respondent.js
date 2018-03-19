export default class Respondent {
    constructor({ identifier, email, organisation, department, role, created = new Date(), lastSeen = new Date(), lastUpdated = new Date() } = {}) {
        Object.assign(this, { identifier, email, organisation, department, role, created, lastSeen, lastUpdated });
        Object.freeze(this);
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return new Respondent(props);
    }

    findConflicts(newValues) {
        const conflicts = [];
        
        if (this.department && newValues.department && this.department !== newValues.department) {
            conflicts.push({ property: 'department', oldValue: this.department, newValue: newValues.department });
        }
        
        if (this.role && newValues.role && this.role !== newValues.role) {
            conflicts.push({ property: 'role', oldValue: this.role, newValue: newValues.role });
        }

        return conflicts;
    }

    get hasBeenAnswered() {
        return !!this.department && !! this.role;
    }

    get hasBeenStarted() {
        return !!this.department || !! this.role;
    }

    get key() {
        return `${this.identifier}`;
    }
}