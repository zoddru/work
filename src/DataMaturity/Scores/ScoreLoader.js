import axios from 'axios';
import qs from 'qs';
import ResponseAggregator from './ResponseAggregator';
import ResponseFilters from './ResponseFilters';

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

    loadAggregatedScores(filters) {
        return loadAggregatedScores(this.surveyState, filters);
    }
}

const loadFilters = (surveyState) => {
    const { respondent, created } = surveyState;

    if (!respondent || !respondent.identifier)
        return Promise.resolve(createFilters(surveyState, surveyState.options));

    const cached = filtersCache.get(respondent.identifier);
    if (cached && cached.created === created)
        return Promise.resolve(cached.filters);

    return axios.get(`/data/currentResponseOptions`)
        .then(r => {
            const filters = createFilters(surveyState, (r.data || {}));
            filtersCache.set(respondent.identifier, { created, filters });
            return filters;
        });
};

const createFilters = (surveyState, options) => {
    const { respondent, organisation } = surveyState;
    const { departments, roles, areaGroups } = options;
    return ResponseFilters.create({ respondent, organisation, departments, roles, areaGroups });
};

const loadOrganisationResponses = (surveyState) => {
    const { organisation, created } = surveyState;

    if (!organisation || !organisation.identifier)
        return Promise.resolve([]);

    const cached = organisationResponsesCache.get(organisation.identifier);
    if (cached && cached.created === created)
        return Promise.resolve(cached.responses);

    return axios.get(`/dmApi/responses?organisation=${organisation.identifier}`)
        .then(r => {
            const responses = (r.data || []);
            organisationResponsesCache.set(organisation.identifier, { created, responses });
            return responses;
        });
};

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

    return axios.get(`/data/scores?${query}`).then(r => {
        const simplified = r.data || [];
        const aggregator = new ResponseAggregator({ survey, responses: [] });
        const scores = simplified.map(s => aggregator.unsimplify(s));
        aggregatedScoreCache.set(survey.identifier, { created, filtersKey, scores });
        return scores;
    });
};