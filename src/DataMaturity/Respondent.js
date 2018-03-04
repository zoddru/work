export default class Respondent {
    constructor({ identifier, email, council, department, role, created = new Date(), lastSeen = new Date(), lastUpdated = new Date() } = {}) {
        Object.assign(this, { identifier, email, council, department, role, created, lastSeen, lastUpdated });
        Object.freeze(this);

        console.log(this);
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return new Respondent(props);
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