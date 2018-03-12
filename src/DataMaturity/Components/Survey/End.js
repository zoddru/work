import React from 'react';
import Result from './Result';

export default class End extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { survey, score } = surveyState;

        const lastQuestion = survey.lastQuestion;
        const lastQuestionKey = !!lastQuestion ? lastQuestion.key : '';

        return <section className="category end" id="end">
            <section class="question">
                <header>
                    <h2>Finished</h2>
                </header>
                <main>
                    <Result score={score} />
                </main>
                <footer>
                    <div className="navigation">
                        <a href={`#${lastQuestionKey}`}
                            className="prev button"
                            onClick={e => this.props.onPrev(`${lastQuestionKey}`, e)}>Previous</a>
                    </div>
                </footer>
            </section>
        </section>;
    }
}