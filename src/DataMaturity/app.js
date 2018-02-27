import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import Survey from './Survey';
import SurveyComponent from './Components/SurveyComponent';
import axios from 'axios';

axios.get('http://api.datamaturity.esd.org.uk/survey')
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    
const data = require('./data.json');
const survey = new Survey(data);
const app = document.getElementById('app');

ReactDom.render(<SurveyComponent survey={survey} />, app);

const sql = [];