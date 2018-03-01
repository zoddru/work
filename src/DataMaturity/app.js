import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import Survey from './Survey';
import SurveyComponent from './Components/SurveyComponent';
import SignInDetails from './Components/SignInDetails';
import axios from 'axios';
import Respondent from './Respondent';

class SurveyApp {
    constructor() {
        this.authenticationStatus = null;
        this.respondentOptions = null;
        this.respondent = null;
        this.survey = null;

        this.getAuthenticationStatus();
        this.getSurveyData();
    }

    getAuthenticationStatus() {
        const self = this;

        axios.get('/authentication/status')
            .then(function (response) {
                self.authenticationStatus = response.data;
                self.initSignIn();
                self.getRespondentOptions(self.authenticationStatus.isSignedIn ? self.authenticationStatus.user.identifier : null);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getRespondentOptions(identifier) {
        const self = this;

        axios.get(`/dmApi/respondentOptions/${identifier}`)
            .then(function (response) {
                const respondentOptions = response.data;
                self.respondent = new Respondent(respondentOptions.respondent || { identifier });
                delete respondentOptions.respondent; // so things don't get confusing later
                self.respondentOptions = respondentOptions;
                self.initSurvey();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getSurveyData() {
        const self = this;

        axios.get('/dmApi/survey')
            .then(function (response) {
                self.survey = new Survey(response.data);
                self.initSurvey();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    initSignIn() {
        const { authenticationStatus } = this;
        const app = document.getElementById('signInApp');
        ReactDom.render(<SignInDetails status={authenticationStatus} />, app);
    }

    initSurvey() {
        const { authenticationStatus, respondent, respondentOptions, survey } = this;

        if (!authenticationStatus || !respondent || !respondentOptions || !survey)
            return; // not yet ready

        const app = document.getElementById('app');
        ReactDom.render(<SurveyComponent survey={survey} respondent={respondent} respondentOptions={respondentOptions} authenticationStatus={authenticationStatus} />, app);
    }
}

new SurveyApp();