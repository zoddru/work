import Respondent from './Respondent';
import Response from './Response';

export default class SurveyState {
    constructor({
        authStatus = { isSignedIn: false },
        options = { departments: [], roles: [] },
        survey = { categories: [], score: (() => ({ categoryScores: [] })) },
        respondent = new Respondent(),
        answers = new Map(),
        loading = true,
    } = {}) {

        this.loading = loading;
        this.authStatus = authStatus;
        this.options = options;
        this.survey = survey; // assume Survey
        this.respondent = respondent; // assume Respondent
        this.answers = answers; // this is a Map, and so can't be frozen

        Object.freeze(this);
    }

    get hasSurvey() {
        return !!this.survey;
    }

    get responses() {
        return Response.createFromMap(this.respondent, this.answers);
    }

    get score() {
        return this.survey.score(this.answers);
    }

    get isSignedIn() {
        if (!this.authStatus)
            return false;
        return this.authStatus.isSignedIn;
    }

    get user() {
        return this.authStatus && this.authStatus.user || null;
    }

    get organisation() {
        return this.user && this.user.organisation || null;
    }

    get organisationLabel() {
        const organisation = this.organisation;
        if (!organisation)
            return null;
        return organisation.shortLabel || organisation.label || false;
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

    findConflicts(newValues) {
        const conflicts = [];
        
        if (this.respondent && newValues.respondent) {
            const respondentConflicts = this.respondent.findConflicts(newValues.respondent);
            if (respondentConflicts.length) {
                conflicts.push({ property: 'respondent', oldValue: this.respondent, newValue: newValues.respondent, conflicts: respondentConflicts });
            }
        }

        return conflicts;
    }
}