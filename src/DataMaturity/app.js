import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import Survey from './Survey';
import Respondent from './Respondent';
import SurveyState from './SurveyState';
import SignInDetails from './Components/SignInDetails';
import SurveyMain from './Components/Survey/Main';
import ResultsMain from './Components/Results/Main';

function getOptions() {
    return axios.get(`/dmApi/respondentOptions`)
        .then(res => {
            return res.data;
        });
}

function getSurvey() {
    return axios.get('/dmApi/survey')
        .then(function (response) {
            return new Survey(response.data);
        });
}

function getAuthThenSavedData() {
    return axios.get('/authentication/status')
        .then(statusRes => {
            const authStatus = statusRes.data;

            renderSignIn(authStatus);

            if (!authStatus.isSignedIn)
                return { authStatus };
            return getSavedData(authStatus);
        });
}

function getSavedData(authStatus) {
    const { identifier, email, organisation } = authStatus.user;
    return axios.get(`/dmApi/responses/${identifier}`)
        .then(function (response) {
            const results = response.data;
            if (!results || !results.length)
                return { authStatus };
            const result = results[0];
            const respondentProps = result.respondent || { identifier, email, council: organisation && organisation.identifier };
            const respondent = new Respondent(respondentProps);
            const responses = !!results.length ? results[0].responses || [] : [];
            return { authStatus, respondentProps, respondent, responses };
        });
}

function renderSignIn(authStatus, ) {
    const app = document.getElementById('signInApp');
    ReactDom.render(<SignInDetails status={authStatus} />, app);
}

function saveSurveyState(surveyState) {
    const { respondent, responses } = surveyState;

    axios.post('/dmApi/responses', {
        respondent,
        responses
    })
        .then(function (response) {
            //console.log(response.data);
        })
        .catch(function (error) {
            //console.log(error);
        });
}

function renderSurvey(surveyState) {
    const app = document.getElementById('mainApp');
    ReactDom.render(<SurveyMain surveyState={surveyState} saveSurveyState={saveSurveyState} />, app);
}

function renderResult(surveyState) {
    const app = document.getElementById('mainApp');
    ReactDom.render(<ResultsMain surveyState={surveyState} />, app);
}

Promise.all([getOptions(), getSurvey(), getAuthThenSavedData()])
    .then(function ([options, survey, authData]) {
        const { authStatus, respondent, responses } = authData;
        const answers = survey.createQAMap(responses || []);
        const surveyState = new SurveyState({ authStatus, options, survey, respondent, answers });

        if (window && window.location && window.location.pathname && window.location.pathname.includes && window.location.pathname.includes('.result.'))
           return renderResult(surveyState);

        renderSurvey(surveyState);
    });