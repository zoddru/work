import Answer from './Answer';

const defaultAnswers = Object.freeze([
    { value: 1, text: 'strongly disagree' }, 
    { value: 2, text: 'disagree' }, 
    { value: 3, text: 'neutral' },
    { value: 4, text: 'agree' },
    { value: 5, text: 'strongly agree' }
]);

const defaultNonAnswers = Object.freeze([
    { value: 'NOT_KNOWN', text: 'don\'t know' },
    { value: 'NOT_UNDERSTOOD', text: 'don\'t understand' }
]);

export default class Question {
    constructor({ category = {}, identifier = 0, text = '', help = '', subCategory = '', answers = defaultAnswers, nonAnswers = defaultNonAnswers }) {

        this.category = category;
        this.identifier = identifier;
        this.text = text;
        this.help = help;
        this.subCategory = subCategory;
        this.answers = Object.freeze(Answer.createArray(this, answers));
        this.nonAnswers = Object.freeze(Answer.createArray(this, nonAnswers));

        Object.freeze(this);
    }

    static get defaultAnswers() {
        return defaultAnswers;
    }

    static createArray(category, data) {
        return data.map((d, i) => {
            const identifier = d.identifier || `${i + 1}`;
            const text = d.text || '';
            const help = d.help || '';
            const subCategory = d.subCategory || '';
            const answers = Array.isArray(d.answers) ? d.answers : defaultAnswers;
            return new Question({ category, identifier, text, help, subCategory, answers });
        });
    }

    findAnswerByValue(value) {
        return this.answers.find(a => a.value === value) || this.nonAnswers.find(a => a.value === value);
    }

    get hasHelp() {
        return !!this.help;
    }

    get prev() {
        const questions = this.category.questions;
        const index = questions.indexOf(this);

        if (index < 0)
            return null;
        
        if (index > 0)
            return questions[index - 1];

        // index === 0
        const prevCategory = this.category.prev;

        if (!prevCategory)
            return null;

        return prevCategory.lastQuestion;
    }

    get next() {
        const questions = this.category.questions;
        const index = questions.indexOf(this);

        if (index < 0)
            return null;
            
        if (index < questions.length - 1)
            return questions[index + 1];

        // index === 0
        const nextCategory = this.category.next;

        if (!nextCategory)
            return null;

        return nextCategory.firstQuestion;
    }

    get key() {
        return `${this.category.key}.question${this.identifier}`;
    }

    get insertSql() {
        const { category, identifier, text, help, subCategory } = this;
        return `insert into Question (category, identifier, [text], help, subCategory) values ('${category.identifier}', '${identifier}', '${text}', '${help}', '${subCategory}');`;
    }
}