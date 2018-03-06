import React from 'react';
import Score from './Score';

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score, caseStudy } = this.props;

        return <section className="category score" id={score.key}>
            <header>
                <h2>{score.label}</h2>
            </header>

            {caseStudy}

            <Score score={score} />
        </section>;
    }
}