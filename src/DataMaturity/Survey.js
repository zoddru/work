import Question from './Question';

export default class Survey {
    constructor(data) {

        const questions = [];
        let number = 1;
        const answers = [ 'strongly disagree', 'disagree', 'neutral', 'agree', 'strongly agree' ];

        data.forEach(q => {
            questions.push(new Question({ number, text: q.question, answers }));
            number += 1;
        })

        this.questions = questions;

        Object.freeze(questions);
        Object.freeze(this);
    }
}