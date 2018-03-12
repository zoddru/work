class Row {
    constructor({ heading, values }) {
        
        this.heading = heading;
        this.values = values;
        
        Object.freeze(this.values);
        Object.freeze(this);
    }
}

export default class Table {
    constructor({ headings = [], rows = [] }) {

        this.headings = headings;
        this.rows = rows.map(r => new Row(r));

        Object.freeze(this.headings);
        Object.freeze(this.rows);
        Object.freeze(this);
    }
};