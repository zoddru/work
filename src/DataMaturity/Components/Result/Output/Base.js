import React from 'react';
import Select from 'react-select';
import SignInDetails from '../../SignInDetails';
import Loading from '../../Loading';
import NotSignedIn from '../../NotSignedIn';
import ScoreLoader from '../../../Scores/ScoreLoader';

const startSortOrder = { respondent: 1, role: 2, department: 3, organisation: 4 };

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilters: [],

            loadingFilters: false,
            filters: [],

            loadingScores: false,
            scores: []
        };

        this.dataPromise = null;
        this.scoresPromise = null;
    }

    filtersChanged(selectedFilters) {
        this.setState(prevState => ({ loadingScores: true, selectedFilters: selectedFilters }));

        const promise = this.dataPromise = new ScoreLoader(this.props.surveyState)
            .loadAggregatedScores(selectedFilters)
            .then(scores => {
                if (this.dataPromise.canceled || promise != this.dataPromise)
                    return;
                this.setState(prevState => ({ loadingScores: false, scores }));
            })
    }

    changeFilters(selectedFilters) {
        this.filtersChanged(selectedFilters);
    }

    componentDidMount() {
        this.setState(prevState => ({ loadingFilters: true }));

        const surveyState = this.props.surveyState;
        const respondent = surveyState.respondent;

        return this.dataPromise = new ScoreLoader(surveyState)
            .loadFiltersAndOrganisationResponses()
            .then(([filters]) => {
                if (this.dataPromise.canceled)
                    return [];
                const selectedFilters = getInitialSelectedFilters(respondent, filters);
                this.setState(prevState => ({ loadingFilters: false, filters, selectedFilters }));
                return selectedFilters;
            })
            .then(selectedFilters => {
                if (this.dataPromise.canceled)
                    return;
                this.filtersChanged(selectedFilters);
            });
    }

    componentWillUnmount() {
        if (this.dataPromise) {
            this.dataPromise.canceled = true;
        }
    }

    render() {
        const { surveyState, isStandAlone } = this.props;
        const { isSignedIn, authStatus, survey, respondent } = surveyState;
        const { loadingFilters } = this.state;

        if (surveyState.loading)
            return <Loading isSubSection={!isStandAlone} />;

        if (!isSignedIn)
            return <NotSignedIn isSubSection={!isStandAlone} status={authStatus} />;

        if (loadingFilters)
            return <Loading isSubSection={!isStandAlone} message="loading filters. just a moment..." />;

        //return <Loading isSubSection={!isStandAlone} message="loading. not loading." />;

        if (!isStandAlone)
            return this.renderMainContent();

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>{this.props.heading}</h2>
                    </header>
                    {this.renderMainContent()}
                </section>
            </article>
        </section >;
    }

    renderMainContent() {
        const { loadingScores, filters, selectedFilters } = this.state;

        const content = loadingScores
            ? <Loading isSubSection={true} message="loading scores. just a moment..." />
            : this.renderChildren();

        return <main class="chart">
            <form className="chart-options">
                <Select
                    name="series"
                    clearable={false}
                    value={selectedFilters}
                    multi
                    onChange={this.changeFilters.bind(this)}
                    options={filters}
                />
            </form>
            {content}
        </main>;
    }

    renderChildren() {
        return 'OUTPUT GOES HERE';
    }

    get aggregatedScores() {

        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
            return null;

        const { loadingScores, scores } = this.state;

        if (loadingScores)
            return null;

        return scores;
    }
}

const getInitialSelectedFilters = (respondent, filters) => {
    if (!respondent || !respondent.identifier)
        return [];
    return filters.filter(f =>
        f.key.identifier === 'default' ||
        !!respondent.role && f.type === 'role' && f.key.identifier === respondent.role ||
        !!respondent.department && f.type === 'department' && f.key.identifier === respondent.department
    ).sort((a, b) => startSortOrder[a.type] - startSortOrder[b.type]);
};