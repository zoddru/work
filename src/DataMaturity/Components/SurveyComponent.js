import React from 'react';
import QuestionComponent from './QuestionComponent';
import Survey from '../Survey';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        const survey = new Survey(props.data);

        this.state = { survey, answers: [] };
    }

    answered(question, answer) {
        const { survey, answers } = this.state;

        const index = survey.questions.indexOf(question);

        if (index < 0)
            return;

        answers[index] = answer;

        this.setState({ answers });
    }

    render() {
        const { survey, answers } = this.state;

        const questions = survey.questions
            .map(q => <QuestionComponent key={q.id} question={q} onAnswered={this.answered.bind(this)} />);

        const nodes = survey.questions
            .map((q, i) => {
                const a = answers[i];
                const className = !!a ? 'node answered' : 'node';
                return <div className={className} key={q.id}><a href={`#question.${q.id}`} className="number">{q.number}</a></div>;
            });

        return <div>
            <nav className="progress">
                {nodes}
            </nav>
            <section class="survey">
                {questions}
            </section>
        </div>;
    }
}