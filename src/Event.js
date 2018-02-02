class Event {
    constructor ({ id, name, description, date }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        Object.freeze(this);
    }

    get timeTill() {
        const now = Date.now();
        return this.date.getTime() - now;
    }
}

module.exports = Event;