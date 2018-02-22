export default class Question {
    constructor({number = 0, text = '', answers = []}) {

        this.number = number;
        this.text = text;
        this.answers = answers.slice();

        Object.freeze(this.answers);
        Object.freeze(this);
    }

    get id() {
        return this.number;
    }
}