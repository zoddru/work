import Section from './Section';

export default class Survey {
    constructor(data) {

        const { identifier, title, sections } = data;

        this.identifier = identifier;
        this.title = title;
        this.sections = Object.freeze(Section.createArray(this, sections));

        Object.freeze(this);
    }

    get key() {
        return `survey${this.identifier}`;
    }
}