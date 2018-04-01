import React from 'react';
import Nav from './Nav';
import NavHelper from '../NavHelper';
import Summary from './Summary';
import Loading from '../Loading';
import NotSignedIn from '../NotSignedIn';
import content from './content';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NavHelper.scrollToHash();
    }

    render() {
        const { score, surveyState } = this.props;

        if (!surveyState.isSignedIn)
            return <NotSignedIn status={surveyState.authStatus} />;

        if (surveyState.loading)
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