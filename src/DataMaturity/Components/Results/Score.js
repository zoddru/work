import React from 'react';
import Tips from './Tips';
import Chart from './Chart';

const resultData = require('./resultData.json');

function getResultText(score) {
    if (!score.hasMean)
        return <p>You haven't answered any questions yet</p>;

    const characteristics = resultData[score.identifier]
        && resultData[score.identifier].characteristics[score.rankLabel];

    if (!characteristics)
        return '';

    return <div>
        <p>
            Your answers indicate that you perceive your council to be at level <strong>{score.rankLabel}</strong> (with a score of <strong></strong> ({score.meanDisplayName}))
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

        if (!score.hasMean)
            return <div><p>You haven't answered any questions yet</p></div>;

        const categoryData = resultData[score.identifier];
        const characteristics = categoryData.characteristics[score.rankLabel];
        const tips = categoryData.tips[score.rankLabel];

        const columnChartData = score.columnChartData;

        return <div>

            {!score.isValid && <div className="warning">
                <p>You haven't filled in enough of the survey to get an accurate score.</p>
            </div>}

            <div class="sub-section">
                <p>
                    Your answers indicate that you perceive your council to be at level <strong>{score.rankLabel}</strong> (with a score of <strong></strong> ({score.meanDisplayName}))
                </p>
                <p>
                    Organisations at this level of data maturity typically have these characteristics:
                </p>
                <Tips tips={characteristics} />
            </div>

            {!!tips && <div class="sub-section">
                <p><strong>Tips for progression</strong></p>
                <Tips tips={tips} />
            </div>}

            {!!columnChartData && <div class="sub-section chart">
                <Chart id={`${score.key}.columnChart`} data={columnChartData} />
            </div>}

        </div>
    };
}