import React from 'react';
import Nav from './Nav';
import Start from './Start';
import Category from './Category';
import End from './End';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { survey } = surveyState;

        const categories = survey.categories
            .map(category => <Category key={category.key} surveyState={surveyState} category={category} onAnswerChanged={this.props.onAnswerChanged.bind(this)} />);

        return <section class="main-content">
            <Nav surveyState={surveyState} />
            <article>
                <div class="main-column">
                    <Start surveyState={surveyState} onRespondentChanged={this.props.onRespondentChanged.bind(this)} />
                    {categories}
                    <End surveyState={surveyState} />
                </div>
            </article>
        </section>;
    }
}