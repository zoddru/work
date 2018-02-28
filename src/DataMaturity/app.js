import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import Survey from './Survey';
import SurveyComponent from './Components/SurveyComponent';
import axios from 'axios';

axios.get('/dmApi/survey')
    .then(function (response) {
        if (response.status === 200) {
            init(response.data);
        }
        else {
            initError(response);
        }
    })
    .catch(function (error) {
        initError(error);
    });

function init(data) {    
    const survey = new Survey(data);
    const app = document.getElementById('app');

    ReactDom.render(<SurveyComponent survey={survey} />, app);
}

function initError(error) {
    console.log(error);
}