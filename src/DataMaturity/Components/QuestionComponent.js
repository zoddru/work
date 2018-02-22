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
        const answer = e.target.value;
        this.setState({ answer });
        this.props.onAnswered(this.question, answer);
    }

    toggleHelp(e) {
        this.setState({ showingHelp: !this.state.showingHelp });
        e.preventDefault();
    }

    render() {
        const question = this.question;
        const questionName = `question.${question.id}`;
        const prevQuestionName = `question.${question.id - 1}`;
        const nextQuestionName = `question.${question.id + 1}`;

        const answers = this.question.answers.map((a, i) => {
            const name = `${questionName}.answer`;
            const id = `${name}.${i}`;
            const isSelected = this.state.answer === a;
            const className = isSelected ? 'answer selected' : 'answer';

            return <div key={id} className={className}>
                <input id={id} name={name} checked={isSelected} type="radio" value={a} onChange={this.selectAnswer.bind(this)} />
                <label for={id}>{a}</label>
            </div>;
        });

        const questionText = parseText(question.text);
        const helpText = parseText(question.help);

        const showingHelp = this.state.showingHelp;
        
        return <section className="question" id={questionName}>
            <span className="number">{question.number}</span>
            <header>
                <h2>Question {question.number}</h2>
            </header>
            <main>

                <div className="text">
                    {questionText}
                </div>
                <div className="help">
                    <a className="expand" href="#" onClick={this.toggleHelp.bind(this)}>More information</a>
                    <div className={showingHelp ? 'help-text expanded' : 'help-text collapsed'}>
                        <br />
                        {helpText}
                    </div>
                </div>
                <div className="answers">
                    {answers}
                </div>
                <div className="feedback">
                    <label for={`${question.id}.feedback`}>Feedback</label>
                    <textarea id={`${question.id}.feedback`} placeholder="tell us any thoughts on this question?" />
                </div>
                <div className="navigation">
                    <a href={`#${prevQuestionName}`} className="prev button">Previous</a>
                    <a href={`#${nextQuestionName}`} className="next button">Next</a>
                </div>
            </main>
        </section>;
    }
}