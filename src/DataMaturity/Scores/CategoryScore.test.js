import test from 'ava';
import Survey from '../Survey';
import Category from '../Category';
import CategoryScore from './CategoryScore';

const surveyData = require('../Testing/surveyData.1.json');

test('create', t => {
    const categoryScore = new CategoryScore({});
    t.truthy(categoryScore);
});

test('create with data', t => {
    const survey = new Survey(surveyData);
    const categoryScore = new CategoryScore({

    });

    t.pass();
});