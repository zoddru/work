import React from 'react';
import Nav from './Nav';
import Summary from './Summary';
import Score from './Score';

import CaseStudyA from './CaseStudies/A';
import CaseStudyB from './CaseStudies/B';
import CaseStudyC from './CaseStudies/C';
import CaseStudyD from './CaseStudies/D';
import CaseStudyE from './CaseStudies/E';

const caseStudies = new Map([
    ['A', CaseStudyA],
    ['B', CaseStudyB],
    ['C', CaseStudyC],
    ['D', CaseStudyD],
    ['E', CaseStudyE]
]);

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            surveyState: props.surveyState
        };
    }

    render() {
        const { surveyState } = this.state;
        const { score } = surveyState;

        const categoryScores = score.categoryScores.map(cs => <Summary key={cs.key} score={cs} caseStudy={caseStudies.get(cs.identifier)} />);
        
        return <div>
            <Nav score={score} />
            <section className="survey result">
                <Summary score={score} />
                {categoryScores}
            </section>
        </div>;
    }
}