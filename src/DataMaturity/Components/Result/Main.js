import React from 'react';
import Nav from './Nav';
import Summary from './Summary';
import content from './content';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score } = this.props;

        const categoryScores = score.categoryScores.map(cs => <Summary key={cs.key} score={cs} content={content[cs.identifier]} />);
        
        return <section class="main-content">
            <Nav score={score} />
            <article>
                <Summary score={score} content={content.Overall} />
                {categoryScores}
            </article>
        </section>;
    }
}