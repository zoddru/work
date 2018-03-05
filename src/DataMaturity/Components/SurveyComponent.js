import React from 'react';
import SurveyNav from './SurveyNav';
import SurveyStart from './SurveyStart';
import CategoryComponent from './CategoryComponent';
import SurveyEnd from './SurveyEnd';

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

        return <div>
            <SurveyNav surveyState={surveyState} />
            <section className="survey">
                <SurveyStart surveyState={surveyState} onRespondentChanged={this.respondentChanged.bind(this)} />
                {categories}
                <SurveyEnd surveyState={surveyState} />
            </section>
        </div>;
    }
}