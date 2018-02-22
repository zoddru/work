import React from 'react';
import QuestionComponent from './QuestionComponent';
import Survey from '../Survey';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        const survey = new Survey(props.data);

        this.state = { survey };
    }

    render() {
        const survey = this.state.survey;

        const questions = survey.questions
            .map(q => <QuestionComponent key={q.id} question={q} />);

        return <section class="survey">
            {questions}
        </section>;
    }
}