import React from 'react';
import Chart from './Chart';

export default class ScoreComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score, content } = this.props;

        if (!score.hasMean)
            return <div><p>You haven't answered any questions yet</p></div>;

        const characteristics = content.characteristics;
        const tips = content.tips;

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
                {characteristics}
            </div>

            {!!tips && <div class="sub-section">
                <p><strong>Tips for progression</strong></p>
                {tips}
            </div>}

            {!!columnChartData && <div class="sub-section chart">
                <Chart id={`${score.key}.columnChart`} data={columnChartData} />
            </div>}

        </div>
    };
}