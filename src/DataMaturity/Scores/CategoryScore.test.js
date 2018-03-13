import test from 'ava';
import Survey from '../Survey';
import Category from '../Category';
import CategoryScore from './CategoryScore';

const surveyData = require('../Testing/surveyData.1.json');
const survey = new Survey(surveyData);
const responsesData = require('../Testing/responses.1.json');
const responses = responsesData.responses;
const answers = survey.createQAMap(responses);

test('check first is valid', t => {
    const category = survey.firstCategory;
    const categoryScore = new CategoryScore({
        category,
        answers
    });

    t.is(categoryScore.isValid, true);
    t.is(categoryScore.hasMean, true);

    const values = responses.filter(r => r.category === 'A' && typeof(r.value) === 'number').map(r => r.value);

    const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
    t.is(categoryScore.mean, mean);
    t.is(categoryScore.meanDisplayName, mean.toFixed(1));
});

test('check second is invalid', t => {
    const category = survey.categories[1];
    const categoryScore = new CategoryScore({
        category,
        answers
    });

    t.is(categoryScore.isValid, false);
    t.is(categoryScore.hasMean, true);

    const values = responses.filter(r => r.category === 'B' && typeof(r.value) === 'number').map(r => r.value);

    const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
    t.is(categoryScore.mean, mean);
    t.is(categoryScore.meanDisplayName, mean.toFixed(1));
});

test('check last is valid', t => {
    const category = survey.lastCategory;
    const categoryScore = new CategoryScore({
        category,
        answers
    });

    t.is(categoryScore.isValid, true);
    t.is(categoryScore.hasMean, true);

    const values = responses.filter(r => r.category === 'C' && typeof(r.value) === 'number').map(r => r.value);

    const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
    t.is(categoryScore.mean, mean);
    t.is(categoryScore.meanDisplayName, mean.toFixed(1));
});