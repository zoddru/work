import React from 'react';
import Nav from './Nav';
import Start from './Start';
import Category from './Category';
import End from './End';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    scrollTo(targetId, e) {
        if (!window)
            return;

        const el = targetId === ''
            ? window.document.body
            : window.document.querySelector(`[id='${targetId}']`);

        if (!el || !el.scrollIntoView)
            return;

        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        el.setAttribute('id', `disabled_${targetId}`);
        window.location.hash = targetId || 'start';
        el.setAttribute('id', targetId);

        e.preventDefault();
    }

    onPrev(targetId, e) {
        this.scrollTo(targetId, e);
    }

    onNext(targetId, e) {
        this.scrollTo(targetId, e);
    }

    render() {
        const { surveyState } = this.props;
        const { survey } = surveyState;

        const categories = survey.categories
            .map(category => <Category key={category.key} 
                                        surveyState={surveyState} 
                                        category={category} 
                                        onAnswerChanged={this.props.onAnswerChanged.bind(this)} 
                                        onPrev={this.onPrev.bind(this)}
                                        onNext={this.onNext.bind(this)} />);

        return <section class="main-content">
            <Nav surveyState={surveyState} />
            <article>
                <div class="main-column">
                    <Start surveyState={surveyState} onRespondentChanged={this.props.onRespondentChanged.bind(this)} onPrev={this.onPrev.bind(this)} onNext={this.onNext.bind(this)} />
                    {categories}
                    <End surveyState={surveyState} onPrev={this.onPrev.bind(this)} onNext={this.onNext.bind(this)} />
                </div>
            </article>
        </section>;
    }
}