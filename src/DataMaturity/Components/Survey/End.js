import React from 'react';
import Result from './Result';
import RespondentDetails from './RespondentDetails';
import { Link } from 'react-router-dom';

export default class End extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { authStatus, options, survey, respondent, score, isSignedIn, hasOrganisation } = surveyState;

        const last = survey.last;
        const lastKey = !!last ? last.key : '';

        const links = !isSignedIn
            ? null
            : <section class="buttons">
                <Link className="button active result" to={{ pathname: '/result', hash: '#' }}>Take me to my results</Link>
                {hasOrganisation && <Link className="link organisation" to={{ pathname: '/organisation', hash: '#' }}>or take me to the results of my organisation</Link>}
            </section>;

        return <section className="category end" id="end">
            <section class="question">
                <header>
                    <h2>Finished</h2>
                </header>
                <main>
                    <RespondentDetails authStatus={authStatus} respondent={respondent} options={options} onRespondentChanged={this.props.onRespondentChanged} />

                    <section class="buttons big">
                        <Link className="button active result" to={{ pathname: '/result', hash: '#' }}>Take me to my results</Link>
                        {hasOrganisation && <Link className="link organisation" to={{ pathname: '/organisation', hash: '#' }}>or take me to the results of my organisation</Link>}
                    </section>
                </main>
                <footer>
                    <div className="navigation">
                        <a href={`#${lastKey}`}
                            className="prev button active"
                            onClick={e => this.props.onPrev(`${lastKey}`, e)}>Previous</a>
                    </div>
                </footer>
            </section>
        </section>;
    }
}