import React from 'react';
import Result from './Result';
import RespondentDetails from './RespondentDetails';
import { Link } from 'react-router-dom';

export default class End extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { authStatus, options, survey, respondent, score } = surveyState;

        const lastQuestion = survey.lastQuestion;
        const lastQuestionKey = !!lastQuestion ? lastQuestion.key : '';

        return <section className="category end" id="end">
            <section class="question">
                <header>
                    <h2>Finished</h2>
                </header>
                <main>
                    <RespondentDetails authStatus={authStatus} respondent={respondent} options={options} onRespondentChanged={this.props.onRespondentChanged} />

                    <section class="buttons">
                        <Link className="button active result" to={{ pathname: '/result', hash: '#' }}>Take me to my results</Link>
                        <Link className="link organisation" to={{ pathname: '/organisation', hash: '#' }}>or take me to the results of my organisation</Link>
                    </section>

                    {/* <Result score={score} /> */}
                </main>
                <footer>
                    <div className="navigation">
                        <a href={`#${lastQuestionKey}`}
                            className="prev button active"
                            onClick={e => this.props.onPrev(`${lastQuestionKey}`, e)}>Previous</a>
                    </div>
                </footer>
            </section>
        </section>;
    }
}