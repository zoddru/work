export default class Respondent {
    constructor({ identifier, email, council, department, role, created, lastSeen, lastUpdated }) {
        Object.assign(this, { identifier, email, council, department, role, created, lastSeen, lastUpdated });
        Object.freeze(this);

        console.log(this);
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return new Respondent(props);
    }

    get key() {
        return `${this.identifier}`;
    }
}