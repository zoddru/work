import React from 'react';
import QuestionComponent from './QuestionComponent';
import Section from '../Section';

export default class SectionComponent extends React.Component {
    constructor(props) {
        super(props);

        const { section, onAnswered } = props;

        this.section = section;
        this.onAnswered = onAnswered;
    }

    render() {
        const { section } = this;

        const questions = section.questions
            .map(question => <QuestionComponent key={question.key} question={question} onAnswered={this.onAnswered} />);

        return <section className="section" id={section.key}>
            <header>
                <h2>{section.title}</h2>
            </header>
            {questions}
        </section>;
    }
}