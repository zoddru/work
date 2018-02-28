import React from 'react';
import CategoryComponent from './CategoryComponent';

export default class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.survey = props.survey;

        this.state = {
            responses: new Map(),
            category: null
        };
    }

    onAnswered(question, answer) {
        this.setState({
            responses: this.state.responses.set(question, answer)
        });
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
        const { survey, state } = this;
        const { responses } = state;
        const firstCategory = survey.firstCategory();
        const firstQuestion = !!firstCategory ? firstCategory.firstQuestion() : null;

        const categories = survey.categories
            .map(category => <CategoryComponent key={category.key} category={category} onAnswered={this.onAnswered.bind(this)} />);

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