const defaultAnswers = Object.freeze([
    { value: -2, text: 'strongly disagree' }, 
    { value: -1, text: 'disagree' }, 
    { value: 0, text: 'neutral' },
    { value: 1, text: 'agree' },
    { value: 2, text: 'strongly agree' }
]);

export default class Question {
    constructor({ section = {}, identifier = 0, text = '', help = '', answers = defaultAnswers }) {

        this.section = section;
        this.identifier = identifier;
        this.text = text;
        this.help = help;
        this.answers = Object.freeze(answers.slice());

        Object.freeze(this);
    }

    static get defaultAnswers() {
        return defaultAnswers;
    }

    static createArray(section, data) {
        return data.map((d, i) => {
            const identifier = d.identifier || `${i + 1}`;
            const text = d.text || '';
            const help = d.help || '';
            const answers = Array.isArray(d.answers) ? d.answers : defaultAnswers;
            return new Question({ section, identifier, text, help, answers });
        });
    }

    get key() {
        return `${this.section.key}.question${this.identifier}`;
    }
}