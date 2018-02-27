import Answer from './Answer';

const defaultAnswers = Object.freeze([
    { value: -2, text: 'strongly disagree' }, 
    { value: -1, text: 'disagree' }, 
    { value: 0, text: 'neutral' },
    { value: 1, text: 'agree' },
    { value: 2, text: 'strongly agree' }
]);

const defaultNonAnswers = Object.freeze([
    { value: 'NOT_KNOWN', text: 'don\'t know' },
    { value: 'NOT_UNDERSTOOD', text: 'don\'t understand' }
]);

export default class Question {
    constructor({ section = {}, identifier = 0, text = '', help = '', category = '', answers = defaultAnswers, nonAnswers = defaultNonAnswers }) {

        this.section = section;
        this.identifier = identifier;
        this.text = text;
        this.help = help;
        this.category = category;
        this.answers = Object.freeze(Answer.createArray(this, answers));
        this.nonAnswers = Object.freeze(Answer.createArray(this, nonAnswers));

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
            const category = d.category || '';
            const answers = Array.isArray(d.answers) ? d.answers : defaultAnswers;
            return new Question({ section, identifier, text, help, category, answers });
        });
    }

    findAnswerByValue(value) {
        return this.answers.find(a => a.value === value) || this.nonAnswers.find(a => a.value === value);
    }

    get prev() {
        const questions = this.section.questions;
        const index = questions.indexOf(this);

        if (index < 0)
            return null;
        
        if (index > 0)
            return questions[index - 1];

        // index === 0
        const prevSection = this.section.prev;

        if (!prevSection)
            return null;

        return prevSection.lastQuestion();
    }

    get next() {
        const questions = this.section.questions;
        const index = questions.indexOf(this);

        if (index < 0)
            return null;
            
        if (index < questions.length - 1)
            return questions[index + 1];

        // index === 0
        const nextSection = this.section.next;

        if (!nextSection)
            return null;

        return nextSection.firstQuestion();
    }

    get key() {
        return `${this.section.key}.question${this.identifier}`;
    }

    get insertSql() {
        const { section, identifier, text, help, category } = this;
        return `insert into Question (section, identifier, [text], help, category) values ('${section.identifier}', '${identifier}', '${text}', '${help}', '${category}');`;
    }
}