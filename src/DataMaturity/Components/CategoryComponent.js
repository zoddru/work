import React from 'react';
import QuestionComponent from './QuestionComponent';
import Category from '../Category';

export default class CategoryComponent extends React.Component {
    constructor(props) {
        super(props);

        const { category, onAnswered } = props;

        this.category = category;
        this.onAnswered = onAnswered;
    }

    render() {
        const { category } = this;

        const questions = category.questions
            .map(question => <QuestionComponent key={question.key} question={question} onAnswered={this.onAnswered} />);

        return <section className="category" id={category.key}>
            <header>
                <h2>{category.title}</h2>
            </header>
            {questions}
        </section>;
    }
}