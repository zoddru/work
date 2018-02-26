import React from 'react';
import SectionComponent from './SectionComponent';
import Survey from '../Survey';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.survey = new Survey(props.data);

        this.state = {
            responses: new Map(),
            section: this.survey.firstSection()
        };
    }

    onAnswered(question, answer) {
        this.setState({
            responses: this.state.responses.set(question, answer)
        });
    }

    gotoSection(section) {
        this.setState({ section });
    }

    gotoQuestion(question) {
    }

    render() {
        const { survey, state } = this;
        const { responses } = state;

        const sections = survey.sections
            .map(section => <SectionComponent key={section.key} section={section} onAnswered={this.onAnswered.bind(this)} />);

        const nodes = [];

        survey.sections.forEach((section, i) => {
            const sectionClassName = section.hasBeenAnswered(responses)
                ? "node answered"
                : section.hasBeenStarted(responses)
                    ? "node started"
                    : "node";

            nodes.push(<div className={sectionClassName} key={section.key}>
                <a href={`#${section.key}`} className="number" onClick={() => this.gotoSection(section)}>{section.identifier}</a>
            </div>);

            if (section !== state.section)
                return;

            section.questions.forEach((question, j) => {
                const questionClassName = !!responses.get(question) ? "node sub-node answered" : "node sub-node";
                nodes.push(<div className={questionClassName} key={question.key}>
                    <a href={`#${question.key}`} className="number" onClick={() => this.gotoQuestion(question)}>{question.identifier}</a>
                </div>);
            });
        });

        return <div>
            <nav className="progress">
                <div class="node">
                    <a href="#start" className="text">Start</a>
                </div>
                {nodes}
                <div class="node">
                    <a href="#end" className="text">Finish</a>
                </div>
            </nav>
            <section class="survey">
                {sections}

                <section class="section end" id="end">
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
            </section>
        </div>;
    }
}