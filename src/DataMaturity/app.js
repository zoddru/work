import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import Survey from './Survey';
import SurveyComponent from './Components/SurveyComponent';
import SignInDetails from './Components/SignInDetails';
import axios from 'axios';

class SurveyApp {
    constructor() {
        this.authenticationStatus = null;
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
        const { survey, authenticationStatus } = this;

        if (!survey || !authenticationStatus)
            return; // not yet ready

        const app = document.getElementById('app');
        ReactDom.render(<SurveyComponent survey={survey} authenticationStatus={authenticationStatus} />, app);
    }
}

new SurveyApp();