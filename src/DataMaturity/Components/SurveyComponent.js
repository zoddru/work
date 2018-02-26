import React from 'react';
import SectionComponent from './SectionComponent';
import Survey from '../Survey';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.survey = new Survey(props.data);
        this.responses = new Map();
    }

    onAnswered(question, answer) {
        this.responses.set(question, answer);
    }

    render() {
        const { survey, responses } = this;

        const sections = survey.sections
            .map(section => <SectionComponent key={section.key} section={section} onAnswered={this.onAnswered.bind(this)} />);

        const nodes = survey.sections
            .map((section, i) => {
                const a = false; //answers[i];
                const className = !!a ? 'node answered' : 'node';
                return <li className={className} key={section.key}>
                    <a href={`#${section.key}`} className="number">{section.identifier}</a>
                    {/* <ul>
                        <li class="node">
                            <a href="#" className="number">1</a>
                        </li>
                    </ul> */}
                </li>;
            });

        return <div>
            <nav className="progress">
                <ul>
                    {nodes}
                </ul>
            </nav>
            <section class="survey">
                {sections}
            </section>
        </div>;
    }
}