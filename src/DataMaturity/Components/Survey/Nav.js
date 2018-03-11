import React from 'react';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expandedCategory: null, currentQuestion: null };
    }

    findTopCategory() {
        const categoryEls = Array.from(window.document.querySelectorAll('.category')).reverse();
        const height = window.innerHeight;
        const topCategoryEl = categoryEls.find(s => s.getBoundingClientRect().top < window.innerHeight);

        if (!topCategoryEl)
            return { start: true };

        const categoryKey = topCategoryEl.id;

        if (!categoryKey)
            return { start: true };
        if (categoryKey === 'end')
            return { end: true };

        const survey = this.props.surveyState.survey;

        return survey.categories.find(s => s.key === categoryKey) || { end: true };
    }

    findTopQuestion(category) {
        if (!category || !category.questions)
            return null;

        const questionEls = Array.from(window.document.querySelectorAll('.question')).reverse();
        const height = window.innerHeight;
        const topQuestionEl = questionEls.find(s => s.getBoundingClientRect().top < window.innerHeight);

        if (!topQuestionEl)
            return null;

        const questionKey = topQuestionEl.id;

        return category.questions.find(s => s.key === questionKey);
    }

    handleScroll() {
        if (this.unmounted) 
            return;
        const expandedCategory = this.findTopCategory();
        const currentQuestion = this.findTopQuestion(expandedCategory);
        
        this.setState({ expandedCategory, currentQuestion });
    }

    render() {
        const { surveyState } = this.props;
        const { respondent, survey, answers } = surveyState;
        const { expandedCategory, currentQuestion } = this.state;

        const startClass = `${respondent.hasBeenAnswered ? 'answered' : respondent.hasBeenStarted ? 'started' : ''} ${expandedCategory && expandedCategory.start && 'selected'}`;
        const endClass = `${expandedCategory && expandedCategory.end && 'selected'}`;

        const nodes = [];

        survey.categories.forEach(category => {
            const isExpandedCategory = (category === expandedCategory);
            const selectedCategoryClassName = !currentQuestion && isExpandedCategory ? 'selected' : '';
            const answeredCategoryClassName = category.hasBeenAnswered(answers) ? 'answered' : category.hasBeenStarted(answers) ? 'started' : '';

            nodes.push(<div className={`node ${selectedCategoryClassName} ${answeredCategoryClassName}`} key={category.key}>
                <a href={`#${category.key}`} className="text">{category.identifier}</a>
            </div>);

            const expandedClassName = isExpandedCategory ? '' : 'collapsed';

            category.questions.forEach(question => {
                const answeredQuestionClassName = !!answers.get(question) ? 'answered' : '';
                const selectedQuestionClassName = question === currentQuestion ? 'selected' : '';
                nodes.push(<div className={`node sub-node ${expandedClassName} ${answeredQuestionClassName} ${selectedQuestionClassName}`} key={question.key}>
                    <a href={`#${question.key}`} className="number">{question.identifier}</a>
                </div>);
            });
        });

        return <nav className="progress">
            <div className={`node ${startClass}`}>
                <a href="#" className="text">Start</a>
            </div>
            {nodes}
            <div className={`node ${endClass}`}>
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
        this.unmounted = true;
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleScroll.bind(this));
    }
}