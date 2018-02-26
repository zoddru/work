import Question from './Question';

export default class Section {
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
            return new Section({ survey, identifier, title, questionData });
        });
    }

    firstQuestion() {
        if (!this.questions.length)
            return null;
        return this.questions[0];
    }

    lastQuestion() {
        if (!this.questions.length)
            return null;
        return this.questions[this.questions.length - 1];
    }

    get prev() {
        const sections = this.survey.sections;
        const index = sections.indexOf(this);
        
        if (index < 0)
            return null;
        
        if (index > 0)
            return sections[index - 1];

        // index === 0
        return null;
    }

    get next() {
        const sections = this.survey.sections;
        const index = sections.indexOf(this);
        
        if (index < 0)
            return null;
        
        if (index < sections.length - 1)
            return sections[index + 1];

        // index === sections.length - 1
        return null;
    }

    get key() {
        return `${this.survey.key}.section${this.identifier}`;
    }
}