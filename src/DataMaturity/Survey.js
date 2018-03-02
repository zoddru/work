import Category from './Category';

export default class Survey {
    constructor(data) {

        const { identifier, title, categories } = data;

        this.identifier = identifier;
        this.title = title;
        this.categories = Object.freeze(Category.createArray(this, categories));

        Object.freeze(this);
    }

    firstCategory() {
        if (!this.categories.length)
            return null;
        return this.categories[0];
    }

    lastCategory() {
        if (!this.categories.length)
            return null;
        return this.categories[this.categories.length - 1];
    }

    findAnswer(response) {
        const category = this.categories.find(c => c.identifier === response.category);
        if (!category)
            return null;
        const question = category.questions.find(q => q.identifier === response.question);
        if (!question)
            return null;
        const value = response.notKnown
            ? 'NOT_KNOWN'
            : response.notUnderstood
                ? 'NOT_UNDERSTOOD'
                : response.value;
        return question.findAnswerByValue(value);
    }

    createQAMap(responses) {
        const survey = this;
        const map = new Map();

        responses.forEach((response) => {
            const answer = survey.findAnswer(response);
            map.set(answer.question, answer);
        });

        return map;
    }

    get key() {
        return `survey${this.identifier}`;
    }
}