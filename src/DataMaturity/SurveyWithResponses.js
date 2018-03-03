import Survey from './Survey';

export default class SurveyWithResponses {
    constructor({ survey, respondent, responses }) {
        this.survey = survey;
        this.respondent = respondent;
        this.responses = responses;

        Object.seal();
    }
}