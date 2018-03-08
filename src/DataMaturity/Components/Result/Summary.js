import React from 'react';
import GenericSection from './GenericSection';
import Chart from './Chart';

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score, content } = this.props;

        const rankContent = content[score.rankLabel];
        
        const warningContent = score.isValid ? null : <p>You haven't filled in enough of the survey to get an accurate score.</p>;
        
        const bestPractice = content.bestPractice;
        const caseStudy = content.caseStudy;

        const tips = !!rankContent && rankContent.tips;
        
        const characteristics = !!rankContent && rankContent.characteristics;
        const scoreContent = !!characteristics && <section className="characteristics">
            <p class="level">
                Your answers indicate that you perceive your council to be at level <strong>{score.rankLabel}</strong>
            </p>
            <p>
                Organisations at this level of data maturity typically have these characteristics:
            </p>
            {characteristics}
        </section>;

        const columnChartData = score.columnChartData;
        const columnChart = !!columnChartData && <Chart id={`${score.key}.columnChart`} data={columnChartData} />;

        const spiderChartData = score.spiderChartData;
        const spiderChart = !!spiderChartData && <Chart id={`${score.key}.spiderChart`} data={spiderChartData} />;

        console.log(JSON.stringify(spiderChartData));

        return <section className="category score" id={score.key}>
            <header>
                <h2>{score.label}</h2>
            </header>

            <GenericSection heading="Warning" className="warning" content={warningContent} />
            
            <div class="columns">
                <div class="main-column">
                    <GenericSection className="score" content={scoreContent} />
                    <GenericSection heading="Case study" className="caseStudy" content={caseStudy} />
                    {columnChart}
                </div>

                <div class="side-column">
                    {spiderChart}
                    <GenericSection heading="Tips for progression" className="tips" content={tips} />
                    <GenericSection heading="Best practice" className="bestPractice" content={bestPractice} />
                </div>
            </div>

        </section>;
    }
}