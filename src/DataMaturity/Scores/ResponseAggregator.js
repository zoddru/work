import ScoreProperties from './ScoreProperties';
import CategoryScore from './CategoryScore';
import Respondent from '../Respondent';

const getMean = function () { return this.numberOfValid > 0 ? (this.sum / this.numberOfValid) : null };

const aggregateByCategory = function (filter) {
    const allResponses = this.responses;

    const byCategory = this.survey.categories
        .map(category => ({ category, numberThatAreBuggy: 0, numberNotKnown: 0, numberNotUnderstood: 0, numberOfValid: 0, sum: 0 }))
        .reduce((obj, agg) => {
            obj[agg.category.identifier] = agg;
            return obj;
        }, {});

    allResponses.forEach(obj => {
        if (!filter(obj))
            return;

        // each responses has a respondent object (probably used in filtering) and 
        // responses array (that respondent's responses)
        // assume each response is about a different question (so don't check this)
        // assume we've filted out resposes that are invalid (for example, it might 
        // be decided that only people who have answered x number questions count 
        // to the total. filter should remove them before we get here)

        obj.responses.forEach(r => {
            const accumulator = byCategory[r.category];

            if (!accumulator)
                return; // unknown category, ignore

            if (r.notKnown) {
                accumulator.numberNotKnown += 1;
                return;
            }

            if (r.notUnderstood) {
                accumulator.numberNotUnderstood += 1;
                return;
            }

            if (typeof (r.value) !== 'number') { // should never happen
                accumulator.numberThatAreBuggy += 1;
                return;
            }

            accumulator.sum += r.value;
            accumulator.numberOfValid += 1;
        });
    });

    return byCategory;
};

class AggregatedScore {
    constructor(props) {
        Object.assign(this, props);
        ScoreProperties.defineProperties(this);
        this.mean = getMean.apply(this);
        Object.freeze(this);
    }

    get simplified() {
        const { category, numberThatAreBuggy, numberNotKnown, numberNotUnderstood, numberOfValid, sum } = this;
        const { identifier, label, survey } = category;
        return { category: { identifier, label, survey: { identifier: survey.identifier, label: survey.label } }, numberThatAreBuggy, numberNotKnown, numberNotUnderstood, numberOfValid, sum };
    }
}

class OverallAggregatedScore extends AggregatedScore {
    constructor(props) {
        super(props);
        Object.freeze(this);
    }

    get simplified() {
        const { key, categoryScores, numberOfValid, sum } = this;

        return {
            key,
            categoryScores: categoryScores.map(cs => cs.simplified),
            numberOfValid,
            sum
        };
    }
}

export default class ResponseAggregator {
    constructor({
        survey = { categories: [] },
        responses = []
    } = {}) {
        this.survey = survey;
        this.responses = responses;
        Object.freeze(this);
    }

    byCategory({ key, filter }) {
        const byCategory = aggregateByCategory.call(this, filter);
        const categoryScores = Object.values(byCategory).map(s => new AggregatedScore(s));

        const { sum, numberOfValid } = CategoryScore.sumValid(categoryScores);

        return new OverallAggregatedScore({
            key,
            categoryScores,
            numberOfValid,
            sum
        });
    }

    unsimplify(simplified) {
        const survey = this.survey;
        const simplifiedCategoryScores = simplified.categoryScores;
        
        const categoryScores = simplifiedCategoryScores.map(cs => {
            const category = survey.categories.find(c => c.identifier === cs.category.identifier);
            const { numberThatAreBuggy, numberNotKnown, numberNotUnderstood, numberOfValid, sum } = cs;
            return new AggregatedScore({ category, numberThatAreBuggy, numberNotKnown, numberNotUnderstood, numberOfValid, sum });
        });

        const { key, sum, numberOfValid } = simplified;

        return new OverallAggregatedScore({
            key,
            categoryScores,
            numberOfValid,
            sum
        });
    }

    multipleByCategory(filters) { // { key: { identifier, label }, filter }
        return filters.map(f => this.byCategory(f));
    }
}