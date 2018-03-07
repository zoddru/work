import React from 'react';
import Nav from './Nav';
import Summary from './Summary';
import Score from './Score';
import content from './content';

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

        const categoryScores = score.categoryScores.map(cs => <Summary key={cs.key} score={cs} content={content[cs.identifier]} />);
        
        return <section class="result">
            <Nav score={score} />
            <section className="survey result">
                <Summary score={score} content={content.Overall} />
                {categoryScores}
            </section>
        </section>;
    }
}