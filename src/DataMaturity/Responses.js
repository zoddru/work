import Question from './Question';

export default class Responses {
    constructor({ survey = {}, identifier = '', title = '', questionData = [] }) {

        this.map = new Maps();

        Object.freeze(this);
    }

    static createArray(survey, data) {
        // todo
    }

    get key() {
        return `${this.survey.key}.category${this.identifier}`;
    }
}