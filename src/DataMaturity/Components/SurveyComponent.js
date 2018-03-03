import React from 'react';
import SurveyNav from './SurveyNav';
import RespondentOptionsComponent from './RespondentOptionsComponent';
import SurveyStart from './SurveyStart';
import CategoryComponent from './CategoryComponent';
import Response from '../Response';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            surveyWithResponses: props.surveyWithResponses
        };
    }

    onAnswered(question, answer) {
        this.setState(prevState => {
            const surveyWithResponses = prevState.surveyWithResponses.changeAnswer(question, answer);
            return { surveyWithResponses };
        });
    }

    render() {
        const { authenticationStatus, options } = this.props;        
        const { surveyWithResponses } = this.state;
        const { respondent, survey } = surveyWithResponses;

        // const { respondent, survey, state } = this;
        // const { responses } = state;
        // const firstCategory = survey.firstCategory();
        // const firstQuestion = !!firstCategory ? firstCategory.firstQuestion() : null;



        // const { authenticationStatus, respondentOptions, onRespondentChanged } = this.props;


        return <div>
            <SurveyNav surveyWithResponses={surveyWithResponses} />
            <section className="survey">
                <SurveyStart authenticationStatus={authenticationStatus} surveyWithResponses={surveyWithResponses} options={options} />
            </section>
            {/* <section className="survey">
                

                {categories}

                <section className="category end" id="end">
                    <header>
                        <h2>Finished</h2>
                    </header>
                    <main>
                        <p>
                            Some preview of the results, or some mechanism to find them.
                        </p>
                        <div className="feedback">
                            <label for={`feedback`}>Feedback</label>
                            <textarea id={`.feedback`} placeholder="tell us any thoughts on this survey?" />
                        </div>
                    </main>
                </section>
            </section> */}
        </div>;
    }
}