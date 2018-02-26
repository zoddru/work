import React from 'react';

function parseText(text) {
    const lines = text.split(/\n/);
    return lines.map((l, i) => <p key={i}>{l}</p>);
}

export default class QuestionComponent extends React.Component {
    constructor(props) {
        super(props);

        this.question = props.question;

        this.state = { answer: null, showingHelp: false };
    }

    selectAnswer(e) {
        let answerValue = parseInt(e.target.value);
        if (isNaN(answerValue)) {
            answerValue = e.target.value;
        }
        const answer = this.question.findAnswerByValue(answerValue);
        this.setState({ answer });
        this.props.onAnswered(this.question, answer);
    }

    toggleHelp(e) {
        this.setState({ showingHelp: !this.state.showingHelp });
        e.preventDefault();
    }

    render() {
        const question = this.question;
        const answer = this.state.answer;

        const prevQuestion = question.prev;
        const nextQuestion = question.next;

        const createAnswer = (a, i) => {
            const isSelected = answer === a;
            const className = isSelected ? 'answer selected' : 'answer';
            
            return <div key={a.key} className={className}>
                <input id={a.key} name={`${question.key}.answer`} checked={isSelected} type="radio" value={a.value} onChange={this.selectAnswer.bind(this)} />
                <label for={a.key}>{a.text}</label>
            </div>;
        };

        const nonAnswers = question.nonAnswers.map(createAnswer);
        const answers = question.answers.map(createAnswer);

        const questionText = parseText(question.text);
        const helpText = parseText(question.help);

        const showingHelp = this.state.showingHelp;

        return <section className="question" id={question.key}>
            <header>
                <h3>Question {question.identifier}</h3>
            </header>
            {<main>
                <div className="text">
                    {questionText}
                </div>
                <div className="help">
                    <a className="expand" href="#" onClick={this.toggleHelp.bind(this)}>More information</a>
                    <div className={showingHelp ? 'help-text expanded' : 'help-text collapsed'}>
                        <br />
                        {helpText}
                        <div className="answers">
                            {nonAnswers}
                        </div>
                    </div>
                </div>
                <div className="answers">
                    {answers}
                </div>
                <div className="navigation">
                    {prevQuestion && <a href={`#${prevQuestion.key}`} className="prev button">Previous</a>}
                    {!!nextQuestion 
                        ? <a href={`#${nextQuestion.key}`} className="next button">Next</a> 
                        : <a href="#end" className="next button">Next</a>}
                </div>
            </main>}
        </section>;
    }
}