import React from 'react';
import RespondentOptionsComponent from './RespondentOptionsComponent';
import CategoryComponent from './CategoryComponent';
import Response from '../Response';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.respondent = props.respondent;
        this.survey = props.survey;

        this.state = {
            responses: props.responses, // responses is a question to answer map
            category: null
        };
    }

    onAnswered(question, answer) {
        const responses = this.state.responses.set(question, answer);

        this.setState({
            responses
        });
        
        this.props.onAnswersChanged(Response.createFromMap(this.respondent, responses));
    }

    expandCategory(category) {
        this.setState({ category });
    }

    expandQuestion(question) {
    }

    findTopCategory() {
        const categoryEls = Array.from(window.document.querySelectorAll('.category')).reverse();
        const height = window.innerHeight;
        const topCategoryEl = categoryEls.find(s => s.getBoundingClientRect().top < window.innerHeight);

        if (!topCategoryEl)
            return null;

        const categoryKey = topCategoryEl.id;

        return this.survey.categories.find(s => s.key === categoryKey);
    }

    handleScroll() {
        const category = this.findTopCategory();
        this.expandCategory(category);
    }

    render() {
        const { respondent, survey, state } = this;
        const { responses } = state;
        const firstCategory = survey.firstCategory();
        const firstQuestion = !!firstCategory ? firstCategory.firstQuestion() : null;

        const categories = survey.categories
            .map(category => <CategoryComponent key={category.key} category={category} responses={responses} onAnswered={this.onAnswered.bind(this)} />);

        const nodes = [];

        survey.categories.forEach((category, i) => {
            const categoryClassName = category.hasBeenAnswered(responses)
                ? 'answered'
                : category.hasBeenStarted(responses) ? 'started' : '';

            nodes.push(<div className={`node ${categoryClassName}`} key={category.key}>
                <a href={`#${category.key}`} className="number">{category.identifier}</a>
            </div>);

            const stateClassName = (category !== state.category) ? 'collapsed' : ''

            category.questions.forEach((question, j) => {
                const questionClassName = !!responses.get(question) ? 'answered' : '';
                nodes.push(<div className={`node sub-node ${stateClassName} ${questionClassName}`} key={question.key}>
                    <a href={`#${question.key}`} className="number">{question.identifier}</a>
                </div>);
            });
        });

        const { authenticationStatus, respondentOptions, onRespondentChanged } = this.props;

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
                <section className="category start question" id="start">
                    <header>
                        <h2>Data Maturity</h2>
                    </header>
                    <main>
                        <RespondentOptionsComponent authenticationStatus={authenticationStatus} respondent={respondent} respondentOptions={respondentOptions} onRespondentChanged={onRespondentChanged} />
                    </main>
                    <footer>
                        <div className="navigation">
                            {firstQuestion && <a href={`#${firstQuestion.key}`} className="next button">Start</a>}
                        </div>
                    </footer>
                </section>

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
            </section>
        </div>;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleScroll.bind(this));
        this.handleScroll();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleScroll.bind(this));
    }
}