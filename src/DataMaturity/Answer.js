export default class Answer {
    constructor({ question = {}, value = 0, text = '' }) {

        this.question = question;
        this.value = value;
        this.text = text;

        Object.freeze(this);
    }

    static createArray(question, data) {
        return data.map((d, i) => {
            const value = typeof d.value === undefined ? `${i + 1}` : d.value;
            const text = d.text || '';
            return new Answer({ question, value, text });
        });
    }

    get identifier() {
        return this.value;
    }

    get key() {
        return `${this.question.key}.answer${this.identifier}`;
    }
}