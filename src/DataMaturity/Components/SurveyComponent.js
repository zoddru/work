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

    expandSection(section) {
        this.setState({ section });
    }

    expandQuestion(question) {
    }

    handleScroll(event) {
        const sectionEls = Array.from(window.document.querySelectorAll('.section'));
        const topSectionEl = sectionEls.find(s => s.getBoundingClientRect().y >= 0);
        
        if (!topSectionEl)
            return;

        const sectionKey = topSectionEl.id;
        const section = this.survey.sections.find(s => s.key === sectionKey);

        this.expandSection(section);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleScroll.bind(this));
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
                <a href={`#${section.key}`} className="number" onClick={() => this.expandSection(section)}>{section.identifier}</a>
            </div>);

            if (section !== state.section)
                return;

            section.questions.forEach((question, j) => {
                const questionClassName = !!responses.get(question) ? "node sub-node answered" : "node sub-node";
                nodes.push(<div className={questionClassName} key={question.key}>
                    <a href={`#${question.key}`} className="number" onClick={() => this.expandQuestion(question)}>{question.identifier}</a>
                </div>);
            });
        });

        return <div>
            <nav className="progress">
                <div className="node">
                    <a href="#start" className="text">Start</a>
                </div>
                {nodes}
                <div className="node">
                    <a href="#end" className="text">Finish</a>
                </div>
            </nav>
            <section className="survey">
                {sections}

                <section className="section end" id="end">
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