import Question from './Question';

export default class Responses {
    constructor({ survey = {}, identifier = '', title = '', questionData = [] }) {

        this.map = new Maps();

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

    get key() {
        return `${this.survey.key}.section${this.identifier}`;
    }
}