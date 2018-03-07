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
                        {lastQuestion && <a href={`#${lastQuestion.key}`} className="prev button">Previous</a>}
                    </div>
                </footer>
            </section>
        </section>;
    }
}