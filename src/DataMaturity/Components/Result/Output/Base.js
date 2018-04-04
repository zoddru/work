import React from 'react';
import Select from 'react-select';
import SignInDetails from '../../SignInDetails';
import Loading from '../../Loading';
import NotSignedIn from '../../NotSignedIn';
import ScoreLoader from '../../../Scores/ScoreLoader';
const Fragment = React.Fragment;

const startSortOrder = { respondent: 1, role: 2, department: 3, organisation: 4, areaGroup: 5 };
const sortFunction = (a, b) => startSortOrder[a.type] - startSortOrder[b.type];

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
            });
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
                const selectedFilters = getInitialSelectedFilters(respondent, filters, this.props.options);
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
        const { isStandAlone } = this.props;

        const chartContent = <div className="chart-content">
            {this.renderChartContent()}
        </div>;

        if (!isStandAlone)
            return chartContent;

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>{this.props.heading}</h2>
                    </header>
                    {chartContent}
                </section>
            </article>
        </section >;
    }

    renderChartContent() {
        const { loadingFilters, loadingScores } = this.state;
        const { surveyState, isStandAlone } = this.props;
        const { isSignedIn, authStatus } = surveyState;

        if (surveyState.loading)
            return <Loading isSubSection={true} />;

        if (!isSignedIn)
            return <NotSignedIn isSubSection={true} status={authStatus} />;

        if (loadingFilters)
            return <Loading isSubSection={true} message="loading filters. just a sec..." />;

        const content = loadingScores
            ? <Loading isSubSection={true} message="loading scores. just a moment..." />
            : this.renderChildren();

        return <Fragment>
            {this.renderFilters()}
            {content}
        </Fragment>;
    }

    renderFilters() {
        const { filters, selectedFilters } = this.state;

        return <form className="chart-options">
            <Select
                name="series"
                clearable={false}
                value={selectedFilters}
                multi
                onChange={this.changeFilters.bind(this)}
                options={filters}
            />
        </form>;
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

const getInitialSelectedFilters = (respondent, filters, options) => {

    if (!respondent || !respondent.identifier)
        return [];

    const initalFilters = options && options.initalFilters;

    if (initalFilters)
        return filters
            .filter(f => initalFilters.filter(f2 => f.key.key === f2.key.key).length > 0)
            .sort(sortFunction);

    return filters.filter(f =>
        f.key.identifier === 'default' ||
        !!respondent.role && f.type === 'role' && f.key.identifier === respondent.role ||
        !!respondent.department && f.type === 'department' && f.key.identifier === respondent.department
    ).sort(sortFunction);
};