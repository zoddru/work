import React from 'react';
import SurveyNav from './SurveyNav';
import SurveyStart from './SurveyStart';
import CategoryComponent from './CategoryComponent';
import Response from '../Response';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            surveyState: props.surveyState
        };
    }

    respondentChanged(respondentProps) {
        const self = this;
        this.setState(prevState => {
            const surveyState = prevState.surveyState.changeRespondent(respondentProps);
            self.props.saveSurveyState(surveyState);
            return { surveyState };
        });
    }

    onAnswerChanged(question, answer) {
        const self = this;
        this.setState(prevState => {
            const surveyState = prevState.surveyState.changeAnswer(question, answer);
            self.props.saveSurveyState(surveyState);

            console.log(surveyState);

            return { surveyState };
        });
    }

    render() {
        const { surveyState } = this.state;
        const { survey } = surveyState;

        const categories = survey.categories
            .map(category => <CategoryComponent key={category.key} surveyState={surveyState} category={category} onAnswerChanged={this.onAnswerChanged.bind(this)} />);

        // const { respondent, survey, state } = this;
        // const { responses } = state;
        // const firstCategory = survey.firstCategory();
        // const firstQuestion = !!firstCategory ? firstCategory.firstQuestion() : null;



        // const { authStatus, respondentOptions, onRespondentChanged } = this.props;



        return <div>
            <SurveyNav surveyState={surveyState} />
            <section className="survey">
                <SurveyStart surveyState={surveyState} onRespondentChanged={this.respondentChanged.bind(this)} />
                {categories}
            </section>

            {/* <section className="survey">
                


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