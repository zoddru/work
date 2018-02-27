import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import Survey from './Survey';
import SurveyComponent from './Components/SurveyComponent';

const data = require('./data.json');
const survey = new Survey(data);
const app = document.getElementById('app');

ReactDom.render(<SurveyComponent survey={survey} />, app);

const sql = [];

survey.sections.forEach(s => {
    s.questions.forEach(q => {
        sql.push(q.insertSql);
    });
});

console.log(sql.join('\n'));