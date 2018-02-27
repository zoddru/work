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

    findTopSection() {
        const sectionEls = Array.from(window.document.querySelectorAll('.section')).reverse();
        const height = window.innerHeight;
        const topSectionEl = sectionEls.find(s => s.getBoundingClientRect().y < window.innerHeight);

        if (!topSectionEl)
            return null;

        const sectionKey = topSectionEl.id;

        return this.survey.sections.find(s => s.key === sectionKey);
    }

    handleScroll() {
        const section = this.findTopSection();

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
        const firstSection = survey.firstSection();
        const firstQuestion = !!firstSection ? firstSection.firstQuestion() : null;

        const sections = survey.sections
            .map(section => <SectionComponent key={section.key} section={section} onAnswered={this.onAnswered.bind(this)} />);

        const nodes = [];

        survey.sections.forEach((section, i) => {
            const sectionClassName = section.hasBeenAnswered(responses)
                ? 'answered'
                : section.hasBeenStarted(responses) ? 'started' : '';

            nodes.push(<div className={`node ${sectionClassName}`} key={section.key}>
                <a href={`#${section.key}`} className="number">{section.identifier}</a>
            </div>);

            const stateClassName = (section !== state.section) ? 'collapsed' : ''

            section.questions.forEach((question, j) => {
                const questionClassName = !!responses.get(question) ? 'answered' : '';
                nodes.push(<div className={`node sub-node ${stateClassName} ${questionClassName}`} key={question.key}>
                    <a href={`#${question.key}`} className="number">{question.identifier}</a>
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
                <section className="section start question" id="start">
                    <header>
                        <h2>Data Maturity</h2>
                    </header>
                    <main>
                        <p>
                            Collect some details about the user here, or they can skip that and enter it later
                        </p>
                    </main>
                    <footer>
                        <div className="navigation">
                            {firstQuestion && <a href={`#${firstQuestion.key}`} className="next button">Start</a>}
                        </div>
                    </footer>
                </section>

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