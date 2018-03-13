import test from 'ava';
import Survey from './Survey';

const surveyData = require('./Testing/surveyData.1.json');

test('create', t => {
    const survey = new Survey(surveyData);

    t.is(survey.key, 'surveyDM');
    t.is(survey.identifier, 'DM');
    t.is(survey.title, 'Data Maturity');
    t.is(survey.categories.length, 2);
    t.is(survey.categories[0].key, `${survey.key}-categoryA`);
    t.is(survey.categories[1].identifier, 'B');
    t.is(survey.categories[1].label, 'Category B');
    t.is(survey.categories[0].questions.length, 6);
    t.is(survey.categories[1].questions[1].key, `${survey.key}-categoryB-question2`);
    t.is(survey.categories[1].questions[1].text, 'Question B.2');
    t.is(survey.categories[0].questions[2].help, 'Help A.3');
});

test('firstCategory', t => {
    const survey = new Survey(surveyData);
    t.truthy(survey.firstCategory);
    t.is(survey.firstCategory, survey.categories[0]);
    t.is(survey.firstCategory.identifier, 'A');
});

test('lastCategory', t => {
    const survey = new Survey(surveyData);
    t.truthy(survey.lastCategory);
    t.is(survey.lastCategory, survey.categories[survey.categories.length - 1]);
    t.is(survey.lastCategory.identifier, 'B');
});

test('firstQuestion', t => {
    const survey = new Survey(surveyData);
    t.truthy(survey.firstQuestion);
    t.is(survey.firstQuestion, survey.categories[0].questions[0]);
    t.is(survey.firstQuestion.key, `surveyDM-categoryA-question1`);
});

test('lastQuestion', t => {
    const survey = new Survey(surveyData);
    t.truthy(survey.lastQuestion);
    t.is(survey.lastQuestion, survey.categories[survey.categories.length - 1].questions[survey.categories[survey.categories.length - 1].questions.length - 1]);
    t.is(survey.lastQuestion.key, `surveyDM-categoryB-question5`);
});

test('createQAMap', t => {
    const survey = new Survey(surveyData);
    const firstCategory = survey.firstCategory;
    const responses = [5, 'NOT_KNOWN', 'NOT_UNDERSTOOD', 2, 1, 2].map((v, i) => ({ category: 'A', question: (i + 1), value: v }));

    const map = survey.createQAMap(responses);

    t.truthy(map);
    t.is(map.size, 6);
    t.is(map.get(firstCategory.firstQuestion).value, 5);
    t.is(map.get(firstCategory.lastQuestion).value, 2);
    t.true(map.get(firstCategory.questions[1]).notKnown);
    t.true(map.get(firstCategory.questions[2]).notUnderstood);
});