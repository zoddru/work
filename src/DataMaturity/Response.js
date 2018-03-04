export default class Response {
    // these are all identifiers for the database

    constructor({ respondent, survey = 'DM', category, question, value, notKnown, notUnderstood, created = new Date(), lastUpdated = new Date() }) {
        Object.assign(this, { respondent, survey, category, question, value, notKnown, notUnderstood, created, lastUpdated });
        Object.freeze(this);
    }

    static createFromAnswer(respondent, answer) {
        respondent = respondent.identifier;
        const survey = answer.question.category.survey.identifier;
        const category = answer.question.category.identifier;
        const question = answer.question.identifier;
        let value = answer.value;

        const notKnown = value === 'NOT_KNOWN';
        const notUnderstood = value === 'NOT_UNDERSTOOD';

        value = (notKnown || notUnderstood) ? null : value;

        return new Response({ respondent, survey, category, question, value, notKnown, notUnderstood });
    }

    static createFromMap(respondent, map) {
        const responses = [];

        map.forEach((answer, question) => {
            responses.push(Response.createFromAnswer(respondent, answer));
        });

        return responses;
    }
}