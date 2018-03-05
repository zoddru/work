const offset = 3;
const minNumberOfValidAnswers = 3;

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

        acc.numberOfValidAnswers += 1;
        acc.sum += answer.value;
        
        return acc;

    }, { 
        sum: 0, 
        numberOfValidAnswers: 0, 
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
        this.mean = score.numberOfValidAnswers === 0
            ? null
            : score.sum / score.numberOfValidAnswers;

        Object.freeze();
    }

    get displayMean () {
        const mean = this.mean;
        if (typeof(mean) === 'number')
            return (offset + mean).toFixed(1);
        return '---';
    }

    get isValid() {
        return this.numberOfValidAnswers >= minNumberOfValidAnswers;
    }

    get key() {
        return `${this.category.key}.score`;
    }
}