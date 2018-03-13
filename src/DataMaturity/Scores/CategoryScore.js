import ScoreProperties from './ScoreProperties';

function calculateScore(questions, answers) {
    return questions.reduce((acc, q) => {
            
        const answer = answers.get(q);
        
        if (!answer) {
            return acc;
        }

        if (answer.notKnown) {
            acc.noNotKnown += 1;
            return acc;
        }

        if (answer.notUnderstood) {
            acc.noNotUnderstood += 1;
            return acc;
        }

        acc.numberOfValid += 1;
        acc.sum += answer.value;
        
        return acc;

    }, { 
        sum: 0, 
        numberOfValid: 0, 
        numberNotKnown: 0, 
        numberNotUnderstood: 0
    });
}

export default class CategoryScore {
    constructor({
        category = { questions: [] },
        answers = new Map()
    } = {}) {

        const score = calculateScore(category.questions, answers);
        Object.assign(this, score);
        this.category = category;
        this.mean = score.numberOfValid === 0
            ? null
            : score.sum / score.numberOfValid;

        ScoreProperties.defineProperties(this);

        Object.freeze();
    }

    get identifier() {
        return this.category.identifier;
    }

    get label() {
        return this.category.label;
    }

    get key() {
        return `${this.category.key}-score`;
    }
}