import React from 'react';
import Question from './Question';

export default class Category extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState, category } = this.props;

        const questions = category.questions
            .map(question => <Question key={question.key} 
                                        surveyState={surveyState} 
                                        question={question} 
                                        onAnswerChanged={this.props.onAnswerChanged}
                                        onPrev={this.props.onPrev}
                                        onNext={this.props.onNext} />);

        return <section className="category" id={category.key}>
            {/* <h2>{category.label}</h2>
            <p>
                {category.description}
            </p> */}
            {questions}
        </section>;
    }
}