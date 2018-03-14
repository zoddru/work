import React from 'react';
import Nav from './Nav';
import Summary from './Summary';
import Chart from './Chart';
import Loading from '../Loading';
import content from './content';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score, loading } = this.props;

        if (loading)
            return <Loading />;

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