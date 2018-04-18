import React from 'react';
import Main from './Main';

export default class RespondentMain extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState, score } = this.props;
        return <Main surveyState={surveyState} score={score} options={this.options} />;
    }
}