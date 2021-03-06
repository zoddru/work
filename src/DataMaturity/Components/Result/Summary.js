import React from 'react';
import GenericSection from './GenericSection';
import TipsForProgression from './TipsForProgression';

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score, content, options, dials, chart } = this.props;

        const invalidWarning = options && options.invalidWarning
            ? options.invalidWarning
            : 'You haven\'t filled in enough of the survey to calculate an accurate score.';

        const warningContent = score.isValid ? null : <p>{invalidWarning}</p>;

        const { bestPractice, caseStudy, signPosting } = content;
        const rankContent = content[score.rankLabel];

        const showChart = score.hasMean || (score.categoryScores && score.categoryScores.filter(cs => cs.hasMean).length > 0);

        const id = score.category ? score.category.key : score.key;

        const questionIds = !!score.category && !!score.category.questions ? score.category.questions.map(q => q.key) : [];
        const questionAnchors = questionIds.map(id => <a key={id} id={id}></a>); // these are useful for switching between tabs

        return <section className="category score" id={id}>

            {questionAnchors}

            <header>
                <h2>{score.category ? score.category.label : null }</h2>
            </header>

            <GenericSection heading="Warning" className="warning" content={warningContent} />

            <main>
                {dials}

                <div className="columns">
                    <div className="main-column">
                        <GenericSection className="score" content={this.renderScoreContent()} />
                        <TipsForProgression content={content} currentRank={score.rankLabel} />
                        <GenericSection heading="Case study" className="caseStudy" content={caseStudy} />
                    </div>

                    <div className="side-column">
                        <GenericSection heading="Best practice" className="bestPractice" content={bestPractice} />
                        <GenericSection heading="Additional resources" className="signPosting" content={signPosting} />
                    </div>
                </div>

                {showChart && chart}
            </main>

        </section>;
    }

    renderScoreContent() {
        const { score, content, options } = this.props;

        const rankContent = content[score.rankLabel];

        const characteristics = !!rankContent && rankContent.characteristics;

        if (!characteristics)
            return null;

        const summaryText = options && options.summaryText
            ? options.summaryText
            : 'Your answers indicate that you perceive your council to be at level';

        return <section className="characteristics">
            <p class="level">
                {summaryText} <strong>{score.rankLabel}</strong>
            </p>
            <p>
                Organisations at this level of data maturity typically have these characteristics:
            </p>
            {characteristics}
        </section>
    }

    renderChart() {
        const { chart } = this.props;

        if (!chart)
            return null;

        return <div class="columns">
            {chart}
        </div>;
    }
}