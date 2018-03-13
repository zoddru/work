export default class Table {
    constructor({ headings = [], rows = [] }) {

        this.headings = headings;
        this.rows = rows;

        Object.freeze(this.headings);
        Object.freeze(this.rows);
        Object.freeze(this);
    }
};