import React from 'react';
import RespondentOptionsComponent from './RespondentOptionsComponent';

export default class SurveyNavNodes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { authenticationStatus, surveyWithResponses, options } = this.props;
        const { survey, respondent } = surveyWithResponses;

        const firstQuestion = survey.firstQuestion;

        return <section className="category start" id="start">
            <header>
                <h2>Data Maturity</h2>
            </header>
            <section class="question">
                <main>
                    <RespondentOptionsComponent authenticationStatus={authenticationStatus} respondent={respondent} options={options} />
                </main>
            </section>
            <footer>
                <div className="navigation">
                    {firstQuestion && <a href={`#${firstQuestion.key}`} className="next button">Start</a>}
                </div>
            </footer>
        </section>;
    }
}