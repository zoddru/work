import React from 'react';

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);

        this.survey = props.survey;
    }

    render() {
        const survey = this.survey;

        const questions = survey.questions.map((question, i) => {
            return <div className="node" key={question.id}><span className="number">{question.number}</span></div>;
        });
        
        return <nav className="progress">
            {questions}
        </nav>;
    }
}