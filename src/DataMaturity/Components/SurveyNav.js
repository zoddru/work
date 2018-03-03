import React from 'react';

export default class SurveyNavNodes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expandedCategory: null };
    }

    expandCategory(expandedCategory) {
        this.setState({ expandedCategory });
    }

    findTopCategoryEl() {
        const categoryEls = Array.from(window.document.querySelectorAll('.category')).reverse();
        const height = window.innerHeight;
        const topCategoryEl = categoryEls.find(s => s.getBoundingClientRect().top < window.innerHeight);

        if (!topCategoryEl)
            return null;

        const categoryKey = topCategoryEl.id;

        return this.props.surveyWithResponses.survey.categories.find(s => s.key === categoryKey);
    }

    handleScroll() {
        const category = this.findTopCategoryEl();
        this.expandCategory(category);
    }

    render() {
        const surveyWithResponses = this.props.surveyWithResponses;
        const { survey, answers } = surveyWithResponses;
        const expandedCategory = this.state.expandedCategory;

        const nodes = [];

        survey.categories.forEach(category => {
            const categoryClassName = category.hasBeenAnswered(answers)
                ? 'answered'
                : category.hasBeenStarted(answers) ? 'started' : '';

            nodes.push(<div className={`node ${categoryClassName}`} key={category.key}>
                <a href={`#${category.key}`} className="number">{category.identifier}</a>
            </div>);

            const expandedClassName = (category !== expandedCategory) ? 'collapsed' : ''

            category.questions.forEach(question => {
                const questionClassName = !!answers.get(question) ? 'answered' : '';
                nodes.push(<div className={`node sub-node ${expandedClassName} ${questionClassName}`} key={question.key}>
                    <a href={`#${question.key}`} className="number">{question.identifier}</a>
                </div>);
            });
        });

        return <nav className="progress">
            <div className="node">
                <a href="#start" className="text">Start</a>
            </div>
            {nodes}
            <div className="node">
                <a href="#end" className="text">Finish</a>
            </div>
        </nav>
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