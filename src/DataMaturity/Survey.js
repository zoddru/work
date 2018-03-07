import Category from './Category';
import SurveyScore from './SurveyScore';

export default class Survey {
    constructor(data) {

        const { identifier, title, categories } = data;

        this.identifier = identifier;
        this.title = title;
        this.categories = Object.freeze(Category.createArray(this, categories));

        Object.freeze(this);
    }

    get firstCategory() {
        if (!this.categories.length)
            return null;
        return this.categories[0];
    }

    get firstQuestion() {
        const firstCategory = this.firstCategory;
        if (!firstCategory)
            return null;
        return firstCategory.firstQuestion;
    }

    get lastCategory() {
        if (!this.categories.length)
            return null;
        return this.categories[this.categories.length - 1];
    }

    get lastQuestion() {
        const lastCategory = this.lastCategory;
        if (!lastCategory)
            return null;
        return lastCategory.lastQuestion;
    }

    score(answers) {
        return new SurveyScore({ survey: this, answers });
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
            if (!answer)
                return;
            map.set(answer.question, answer);
        });

        return map;
    }

    get key() {
        return `survey${this.identifier}`;
    }
}