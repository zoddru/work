import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import SurveyComponent from './Components/SurveyComponent';

const data = require('./data.json');
const app = document.getElementById('app');

ReactDom.render(<SurveyComponent data={data} />, app);