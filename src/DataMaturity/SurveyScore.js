import ScoreProperties from './ScoreProperties';

function calculateScore(categories, answers) {
    return categories.reduce((acc, c) => {
            
        const categoryScore = c.score(answers);
        acc.categoryScores.push(categoryScore);
        
        if (!categoryScore.isValid) {
            return acc;
        }

        acc.numberOfValid += 1;
        acc.sum += categoryScore.mean;
        
        return acc;

    }, {
        categoryScores: [],
        sum: 0, 
        numberOfValid: 0
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
        this.mean = score.numberOfValid === 0
            ? null
            : score.sum / score.numberOfValid;

        ScoreProperties.defineProperties(this);

        Object.freeze();
    }

    get identifier() {
        return 'overall';
    }

    get label() {
        return 'Overall';
    }

    get key() {
        return `${this.survey.key}.score`;
    }
}