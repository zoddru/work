export default class Question {
    constructor({number = 0, text = '', help = '', answers = []}) {

        this.number = number;
        this.text = text;
        this.help = help;
        this.answers = answers.slice();

        Object.freeze(this.answers);
        Object.freeze(this);
    }

    get id() {
        return this.number;
    }
}