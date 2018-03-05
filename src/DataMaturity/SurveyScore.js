const offset = 3;
const minNumberOfValidScores = 3;

function calculateScore(categories, answers) {
    return categories.reduce((acc, c) => {
            
        const categoryScore = c.score(answers);
        acc.categoryScores.push(categoryScore);
        
        if (!categoryScore.isValid) {
            return acc;
        }

        acc.numberOfValidScores += 1;
        acc.sum += categoryScore.mean;
        
        return acc;

    }, {
        categoryScores: [],
        sum: 0, 
        numberOfValidScores: 0
    });
}

export default class SurveyScore {
    constructor({
        survey = { categories: [] },
        answers = new Map()
    } = {}) {

        const score = calculateScore(survey.categories, answers);

        Object.assign(this, score);
        this.survey = survey;
        this.mean = score.numberOfValidScores === 0
            ? null
            : score.sum / score.numberOfValidScores;

        Object.freeze();
    }

    get displayMean () {
        const mean = this.mean;
        if (typeof(mean) === 'number')
            return (offset + mean).toFixed(1);
        return '---';
    }

    get isValid() {
        return this.numberOfValidScores >= minNumberOfValidScores;
    }

    get key() {
        return `${this.survey.key}.score`;
    }
}