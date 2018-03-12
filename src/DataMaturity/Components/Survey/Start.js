import React from 'react';
import RespondentDetails from './RespondentDetails';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { authStatus, options, survey, respondent } = surveyState;

        const firstQuestion = survey.firstQuestion;
        const firstQuestionKey = !!firstQuestion ? firstQuestion.key : 'end';

        return <section className="category start">            
            <section class="question">
                <header>
                    <h2>Data Maturity</h2>
                </header>
                <main>
                    <RespondentDetails authStatus={authStatus} respondent={respondent} options={options} onRespondentChanged={this.props.onRespondentChanged} />
                </main>
                <footer>
                    <div className="navigation">
                        <a href={`#${firstQuestionKey}`} 
                            className="next button"
                            onClick={e => this.props.onNext(`${firstQuestionKey}`, e)}>Start</a>
                    </div>
                </footer>
            </section>
        </section>;
    }
}