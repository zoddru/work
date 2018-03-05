import React from 'react';
import SurveyResults from './SurveyResults';

export default class SurveyEnd extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { survey, score } = surveyState;

        const lastQuestion = survey.lastQuestion;
        
        return <section className="category end" id="end">
            <header>
                <h2>Finished</h2>
            </header>
            <main>
                <SurveyResults score={score} />

                <div className="feedback">
                    <label for={`feedback`}>Feedback</label>
                    <textarea id={`.feedback`} placeholder="tell us any thoughts on this survey?" />
                </div>
            </main>
            <footer>
                <div className="navigation">
                    {lastQuestion && <a href={`#${lastQuestion.key}`} className="prev button">Previous</a>}
                </div>
            </footer>
        </section>;
    }
}