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

    hasOrganisationChanged(nextProps) {
        const currentOrg = this.props.surveyState.organisation;
        const nextOrg = nextProps.surveyState.organisation;
        return (currentOrg !== nextOrg);
    }

    changeFilters(selectedFilters) {
        this.filtersChanged(selectedFilters);
    }

    init(props) {
        if (props.surveyState.loading)
            return;
        this.loadData(props);
    }

    loadData(props) {
        this.setState(prevState => ({ loadingFilters: true }));

        const surveyState = props.surveyState;
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

    componentDidMount() {
        this.init(this.props);
    }

    componentWillUnmount() {
        if (this.dataPromise) {
            this.dataPromise.canceled = true;
        }
    }

    render() {
        const { surveyState } = this.props;
        const { isSignedIn, authStatus, survey, respondent } = surveyState;
        const { loadingFilters, filters, selectedFilters } = this.state;

        if (surveyState.loading)
            return <Loading />;

        if (!isSignedIn)
            return <NotSignedIn status={authStatus} />;

        if (loadingFilters)
            return <Loading message="loading filters. just a moment..." />;

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>{this.props.heading}</h2>
                    </header>
                    <main class="chart">
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
                        {this.renderLoadingOrChildren()}
                    </main>
                </section>
            </article>
        </section >;
    }

    renderLoadingOrChildren() {
        const { loadingScores } = this.state;

        if (loadingScores)
            return <Loading isSubSection={true} message="loading scores. just a moment..." />;

        return this.renderChildren();
    }

    renderChildren() {
        return 'OUTPUT GOES HERE';
    }

    get aggregatedScores() {
        
        const { loadingScores, scores } = this.state;

        if (loadingScores)
            return null;

        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
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