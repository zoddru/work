import axios from 'axios';
import qs from 'qs';
import ResponseAggregator from './ResponseAggregator';
import ResponseFilters from './ResponseFilters';
import { isArray } from 'util';

const filtersCache = new Map();
const organisationResponsesCache = new Map();
const aggregatedScoreCache = new Map();

export default class ScoreLoader {
    constructor(surveyState) {
        this.surveyState = surveyState;
    }

    loadFilters() {
        return loadFilters(this.surveyState);
    }

    loadOrganisationResponses() {
        return loadOrganisationResponses(this.surveyState);
    }

    loadFiltersAndOrganisationResponses() {
        return Promise.all([
            this.loadFilters(),
            this.loadOrganisationResponses()
        ]);
    }

    loadAggregatedScores(filters) {
        if (!filters || !filters.length)
            return Promise.resolve([]);

        if (filters.filter(f => !f.local).length > 0)
            return loadAggregatedScores(this.surveyState, filters);

        return this.loadOrganisationResponses()
            .then(responses => {
                const survey = this.surveyState.survey;
                return new ResponseAggregator({ survey, responses })
                    .multipleByCategory(filters);
            });
    }
}

const loadFilters = (surveyState) => {
    const { respondent, created } = surveyState;

    if (!respondent || !respondent.identifier)
        return Promise.resolve(createFilters(surveyState, surveyState.options));

    const cached = filtersCache.get(respondent.identifier);

    if (cached && cached.created === created && !!cached.filters)
        return Promise.resolve(cached.filters);

    if (cached && cached.created === created && !!cached.request)
        return cached.request;

    const request = axios.get(`/data/currentResponseOptions`)
        .then(r => {
            const filters = createFilters(surveyState, (r.data || {}));
            filtersCache.set(respondent.identifier, { created, filters });
            return filters;
        });

    filtersCache.set(respondent.identifier, { created, request });

    return request;
};

const createFilters = (surveyState, options) => {
    const { respondent, organisation } = surveyState;
    const { departments, roles, areaGroups } = options;
    return ResponseFilters.create({ respondent, organisation, departments, roles, areaGroups });
};

const loadOrganisationResponses = (surveyState) => {
    const { organisation, created } = surveyState;

    if (!organisation || !organisation.identifier) {
        const { responses, respondent } = surveyState;
        return Promise.resolve([{ responses, respondent }]);
    }

    const cached = organisationResponsesCache.get(organisation.identifier);

    if (cached && cached.created === created && !!cached.responses)
        return Promise.resolve(cached.responses);

    if (cached && cached.created === created && !!cached.request)
        return cached.request;

    const request = axios.get(`/dmApi/responses?organisation=${organisation.identifier}`)
        .then(r => {
            const responses = (r.data || []);
            organisationResponsesCache.set(organisation.identifier, { created, responses });
            return responses;
        });

    organisationResponsesCache.set(organisation.identifier, { created, request });

    return request;
};

const currentRequests = new Map();

const loadAggregatedScores = (surveyState, filters) => {
    const { survey, created } = surveyState;

    if (!survey)
        return Promise.resolve([]);

    const filterKeys = filters.map(f => f.key.key);
    const filtersKey = filterKeys.join('-');

    const cached = aggregatedScoreCache.get(survey.identifier);

    if (cached && cached.created === created && cached.filtersKey === filtersKey)
        return Promise.resolve(cached.scores);

    const query = qs.stringify({ filter: filterKeys }, { arrayFormat: 'repeat' });
    const requestUrl = `/data/scores?${query}`;

    if (currentRequests.has(requestUrl))
        return currentRequests.get(requestUrl);

    const request = axios
        .get(requestUrl)
        .then(r => {
            currentRequests.delete(requestUrl);
            const simplified = r.data || [];
            const aggregator = new ResponseAggregator({ survey, responses: [] });
            const scores = simplified.map(s => aggregator.unsimplify(s));
            aggregatedScoreCache.set(survey.identifier, { created, filtersKey, scores });
            return scores;
        });

    currentRequests.set(requestUrl, request);

    return request;
};