import Section from './Section';

export default class Survey {
    constructor(data) {

        const { identifier, title, sections } = data;

        this.identifier = identifier;
        this.title = title;
        this.sections = Object.freeze(Section.createArray(this, sections));

        Object.freeze(this);
    }
    
    firstSection() {
        if (!this.sections.length)
            return null;
        return this.sections[0];
    }

    lastSection() {
        if (!this.sections.length)
            return null;
        return this.sections[this.sections.length - 1];
    }

    get key() {
        return `survey${this.identifier}`;
    }
}