import React from 'react';
import Question from './Question';
import common from './../../common';

export default class Category extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState, category } = this.props;

        const categoryText = common.parseText(category.description);

        const questions = category.questions
            .map(question => <Question key={question.key}
                surveyState={surveyState}
                question={question}
                onAnswerChanged={this.props.onAnswerChanged}
                onPrev={this.props.onPrev}
                onNext={this.props.onNext} />);

        const prevKey = category.prevKey;
        const nextKey = category.nextKey;

        return <section className="category" id={category.key}>

            <section className="question">
                <header>
                    <h2>{category.label}</h2>
                </header>
                <main>
                    <div className="text">
                        {categoryText}
                    </div>
                </main>
                <footer>
                    <div className="navigation">
                        {<a href={`#${prevKey}`} className="prev button active" onClick={e => this.props.onPrev(prevKey, e)}>Previous</a>}
                        {<a href={`#${nextKey}`} className="next button active" onClick={e => this.props.onNext(nextKey, e)}>Next</a>}
                    </div>
                </footer>
            </section>

            {questions}

        </section>;
    }
}