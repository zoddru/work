import React from 'react';
import Nav from './Nav';
import Start from './Start';
import Category from './Category';
import End from './End';

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

            return { surveyState };
        });
    }

    render() {
        const { surveyState } = this.state;
        const { survey } = surveyState;

        const categories = survey.categories
            .map(category => <Category key={category.key} surveyState={surveyState} category={category} onAnswerChanged={this.onAnswerChanged.bind(this)} />);

        return <section class="main-content">
            <Nav surveyState={surveyState} />
            <article>
                <div class="main-column">
                    <Start surveyState={surveyState} onRespondentChanged={this.respondentChanged.bind(this)} />
                    {categories}
                    <End surveyState={surveyState} />
                </div>
            </article>
        </section>;
    }
}