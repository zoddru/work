import React from 'react';

function parseText(text) {
    const lines = text.split(/\n/);
    return lines.map((l, i) => <p key={i}>{l}</p>);
}

export default class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showingHelp: false };
    }

    selectAnswer(e) {
        let answerValue = parseInt(e.target.value);
        if (isNaN(answerValue)) {
            answerValue = e.target.value;
        }
        const answer = this.props.question.findAnswerByValue(answerValue);
        this.props.onAnswerChanged(this.props.question, answer);
    }

    toggleHelp(e) {
        this.setState(prevState => { return { showingHelp: !prevState.showingHelp } });
        e.preventDefault();
    }

    render() {
        const { question, surveyState } = this.props;
        const answer = surveyState.answers.get(question);
        const showingHelp = this.state.showingHelp;

        const createAnswer = (a, i) => {
            const isAnswer = a === answer;
            const labelClassName = isAnswer ? 'button active' : 'button';
            
            return <div key={a.key} className="answer">
                <input id={a.key} name={`${question.key}.answer`} checked={isAnswer} type="radio" value={a.value} onChange={this.selectAnswer.bind(this)} />
                <label for={a.key} className={labelClassName}>{a.text}</label>
            </div>;
        };

        const nonAnswers = question.nonAnswers.map(createAnswer);
        const answers = question.answers.map(createAnswer);

        const questionText = parseText(question.text);
        const helpText = parseText(question.help);

        const prevQuestion = question.prev;
        const prevQuestionKey = !!prevQuestion ? prevQuestion.key: '';
        const nextQuestion = question.next;
        const nextQuestionKey = !!nextQuestion ? nextQuestion.key: 'end';

        return <section className="question" id={question.key}>
            <header>
                <h3>{question.category.label} {question.identifier}</h3>
            </header>
            <main>
                <div className="text">
                    {questionText}
                </div>
                {question.hasHelp && <div className="help">
                    <a className="expand" href="#" onClick={this.toggleHelp.bind(this)}>More information</a>
                    <div className={showingHelp ? 'help-text expanded' : 'help-text collapsed'}>
                        <br />
                        {helpText}
                    </div>
                </div>}
                <div className="answers">
                    {answers}
                </div>
                <div className="help">
                    <div className="answers">
                        {nonAnswers}
                    </div>
                </div>          
            </main>
            <footer>
                <div className="navigation">
                    {<a href={`#${prevQuestionKey}`} className="prev button active" onClick={e => this.props.onPrev(`${prevQuestionKey}`, e)}>Previous</a>}
                    {<a href={`#${nextQuestionKey}`} className="next button active" onClick={e => this.props.onNext(`${nextQuestionKey}`, e)}>Next</a>}
                </div>
            </footer>
        </section>;
    }
}