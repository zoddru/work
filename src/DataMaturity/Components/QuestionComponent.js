import React from 'react';

export default class QuestionComponent extends React.Component {
    constructor(props) {
        super(props);

        this.question = props.question;
    }

    render() {
        const question = this.question;

        const answers = this.question.answers.map((a, i) => {
            const name = `${question.id}.answer`;
            const id = `${name}.${i}`;
            
            return <div key={id} class="answer">
                <input class="answer" id={id} name={name} type="radio" />
                <label for={id}>{a}</label>
            </div>;
        });

        return <section class="question">
            <span class="number">{question.number}</span>
            <div class="content">
                <p class="text">
                    {question.text}
                </p>
                <div class="answers">
                    {answers}
                </div>
                <a href="#" class="prev button">Previous</a>
                <a href="#" class="next button">Next</a>
            </div>
        </section>;
    }
}