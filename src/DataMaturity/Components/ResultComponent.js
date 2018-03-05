import React from 'react';
import ResultNav from './ResultNav';
import ScoreComponent from './ScoreComponent';

export default class ResultComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            surveyState: props.surveyState
        };
    }

    render() {
        const { surveyState } = this.state;
        const { score } = surveyState;

        const categoryScores = score.categoryScores.map(cs => <ScoreComponent key={cs.key} score={cs} />);

        return <div>
            <ResultNav score={score} />
            <section className="survey result">
                <ScoreComponent score={score} />
                {categoryScores}
            </section>
        </div>;
    }
}