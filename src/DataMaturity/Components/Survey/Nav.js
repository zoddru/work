import React from 'react';
import NavHelper from '../NavHelper';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expandedCategory: null, currentQuestion: null };
    }

    handleScroll() {
        if (this.unmounted || !this.props.surveyState.survey) 
            return;
        const categories = this.props.surveyState.survey.categories;
        const expandedCategory = NavHelper.findTopElement('.category', categories);
        const currentQuestion = NavHelper.findTopQuestion(expandedCategory);
        
        this.setState({ expandedCategory, currentQuestion });
    }

    render() {
        const { surveyState } = this.props;
        const { respondent, survey, answers } = surveyState;
        const { expandedCategory, currentQuestion } = this.state;

        const startClass = `answered ${expandedCategory && expandedCategory.isStart && 'selected'}`;
        const endClass = `${respondent.hasBeenAnswered ? 'answered' : respondent.hasBeenStarted ? 'started' : ''} ${expandedCategory && expandedCategory.isEnd && 'selected'}`;

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