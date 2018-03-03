import Question from './Question';

export default class Category {
    constructor({ survey = {}, identifier = '', title = '', questionData = [] }) {

        this.survey = survey;
        this.identifier = identifier;
        this.title = title;
        this.questions = Object.freeze(Question.createArray(this, questionData));

        Object.freeze(this);
    }

    static createArray(survey, data) {
        return data.map((d, i) => {
            const identifier = d.identifier || `${i + 1}`;
            const title = d.title || '';
            const questionData = Array.isArray(d.questions) ? d.questions : [];
            return new Category({ survey, identifier, title, questionData });
        });
    }

    hasBeenStarted(answers) {
        return !!this.questions.find(q => !!answers.get(q));
    }

    hasBeenAnswered(answers) {
        return this.questions.every(q => !!answers.get(q));
    }

    get firstQuestion() {
        if (!this.questions.length)
            return null;
        return this.questions[0];
    }

    get lastQuestion() {
        if (!this.questions.length)
            return null;
        return this.questions[this.questions.length - 1];
    }

    get prev() {
        const categories = this.survey.categories;
        const index = categories.indexOf(this);
        
        if (index < 0)
            return null;
        
        if (index > 0)
            return categories[index - 1];

        // index === 0
        return null;
    }

    get next() {
        const categories = this.survey.categories;
        const index = categories.indexOf(this);
        
        if (index < 0)
            return null;
        
        if (index < categories.length - 1)
            return categories[index + 1];

        // index === categories.length - 1
        return null;
    }

    get key() {
        return `${this.survey.key}.category${this.identifier}`;
    }
}