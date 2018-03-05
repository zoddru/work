import Respondent from './Respondent';
import Response from './Response';

export default class SurveyState {
    constructor({
        authStatus = { isSignedIn: false },
        options = { departments: [], roles: [] },
        survey = { categories: [] },
        respondent = new Respondent(),
        answers = new Map()
    } = {}) {

        this.authStatus = authStatus;
        this.options = options;
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

    get responses() {
        return Response.createFromMap(this.respondent, this.answers);
    }

    get score() {
        return this.survey.score(this.answers);
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return new SurveyState(props);
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