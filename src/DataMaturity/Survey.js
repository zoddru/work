import Category from './Category';
import SurveyScore from './Scores/SurveyScore';

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

    get key() {
        return `survey${this.identifier}`;
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

    attemptToMergeAnswers(oldAnswers, newAnswers) {
        const merged = new Map();
        const conflicts = new Map();

        this.categories.forEach(c => {
            c.questions.forEach(q => {
                const oldValue = oldAnswers.get(q);
                const newValue = newAnswers.get(q);

                if (!oldValue && !newValue)
                    return;
                if (!!oldValue && !newValue) {
                    merged.set(q, oldValue);
                    return;
                }
                if (!oldValue && !!newValue) {
                    merged.set(q, newValue);
                    return;
                }
                if (oldValue.equals(newValue)) {
                    merged.set(q, newValue);
                    return;
                }
                else {
                    merged.set(q, oldValue); // don't change the old value by default
                    conflicts.set(q, { oldValue, newValue });
                }
            });
        });

        return { merged, conflicts };
    }

    overwriteAnswers(oldAnswers, newAnswers) {
        const merged = new Map();

        this.categories.forEach(c => {
            c.questions.forEach(q => {
                const newValue = newAnswers.get(q);
                if (newValue) {
                    merged.set(q, newValue);
                    return;
                }
                const oldValue = oldAnswers.get(q);
                if (oldValue) {
                    merged.set(q, oldValue);
                    return;
                }
            });
        });

        return merged;
    }
}