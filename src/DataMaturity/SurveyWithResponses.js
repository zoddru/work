import Survey from './Survey';

export default class SurveyWithResponses {
    constructor({ survey = null, respondent = null, answers = null } = {}) {
        this.survey = survey; // assume Survey
        this.respondent = respondent; // assume Respondent
        this.answers = answers; // this is a Map, and so can't be frozen

        Object.freeze();
    }

    get hasSurvey() {
        return !!this.survey;
    }

    get hasRespondent() {
        return !!this.respondent;
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return new SurveyWithResponses(props);
    }

    changeRespondent(newValues) {
        const respondent = this.respondent.change(newValues);
        return this.change({ respondent });
    }

    changeAnswer(question, answer) {
        const answers = this.answers.set(question, answer);
        return this.change({ answers });
    }
}