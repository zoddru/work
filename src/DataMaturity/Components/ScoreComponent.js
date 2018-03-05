import React from 'react';

const resultData = require('../resultData.json');

function getResultText(score) {
    if (!score.hasMean)
        return <p>You haven't answered any questions yet</p>;

    const characteristics = resultData[score.identifier]
        && resultData[score.identifier].characteristics[score.rankLabel];

    if (!characteristics)
        return '';

    return <div>
        {!score.isValid && <p className="warning">
            You haven't filled in enough of the survey to get an accurate score.
        </p>}
        <p>
            Your answers indicate that you perceive your council to be at level <strong>{score.rankLabel}</strong> (with a score of <strong></strong> ({score.meanDisplayName})
        </p>
        <p>
            Organisations at this level of data maturity typically have these characteristics:
        </p>
        {(!Array.isArray(characteristics)
            ? <p>{characteristics}</p>
            : <ul>{characteristics.map((c, i) => <li key={i}>{c}</li>)}</ul>)}
    </div>;
}

export default class ScoreComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score } = this.props;

        return <section className="category score" id={score.key}>
            <header>
                <h2>{score.label}</h2>
            </header>
            {getResultText(score)}
        </section>;
    }
}