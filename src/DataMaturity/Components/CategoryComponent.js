import React from 'react';
import QuestionComponent from './QuestionComponent';
import Category from '../Category';

export default class CategoryComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState, category } = this.props;

        const questions = category.questions
            .map(question => <QuestionComponent key={question.key} surveyState={surveyState} question={question} onAnswerChanged={this.props.onAnswerChanged} />);

        return <section className="category" id={category.key}>
            <header>
                <h2>{category.label}</h2>
            </header>
            {questions}
        </section>;
    }
}