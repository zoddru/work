import test from 'ava';
import Survey from './Survey';

const surveyData = require('./Testing/surveyData.1.json');

test('create', t => {
    const survey = new Survey(surveyData);

    t.is(survey.key, 'surveyDM');
    t.is(survey.identifier, 'DM');
    t.is(survey.title, 'Data Maturity');
    t.is(survey.categories.length, 3);
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
    t.is(survey.lastCategory.identifier, 'C');
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
    t.is(survey.lastQuestion.key, `surveyDM-categoryC-question5`);
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

const createNoConflictMergeData = (t) => {
    const survey = new Survey(surveyData);
    const firstCategory = survey.firstCategory;
    const questions = firstCategory.questions;
    const responses1 = [5, 'NOT_KNOWN', 'NOT_UNDERSTOOD', null, null, 3].map((v, i) => ({ category: 'A', question: (i + 1), value: v })).filter(r => r.value !== null);
    const answers1 = survey.createQAMap(responses1);
    t.is(answers1.size, 4);
    
    const responses2 = [null, 'NOT_KNOWN', 'NOT_UNDERSTOOD', 1, 2, 3].map((v, i) => ({ category: 'A', question: (i + 1), value: v })).filter(r => r.value !== null);
    const answers2 = survey.createQAMap(responses2);
    t.is(answers2.size, 5);

    const mergeReport = survey.mergeAnswers(answers1, answers2);

    return { survey, questions, mergeReport };
};

test('mergeAnswers - no conflict', t => {
    const { survey, questions, mergeReport } = createNoConflictMergeData(t);

    t.false(mergeReport.hasConflicts);
    t.is(mergeReport.conflicts.size, 0);
    t.is(mergeReport.preserved.size, 6);
    t.is(mergeReport.overwritten.size, 6);
});

test('mergeAnswers - no conflict - kept old value', t => {
    const { survey, questions, mergeReport } = createNoConflictMergeData(t);

    t.is(mergeReport.preserved.get(questions[0]).value, 5);
    t.is(mergeReport.overwritten.get(questions[0]).value, 5);
});

test('mergeAnswers - no conflict - kept unaltered value', t => {
    const { survey, questions, mergeReport } = createNoConflictMergeData(t);

    t.is(mergeReport.preserved.get(questions[1]).value, 'NOT_KNOWN');
    t.is(mergeReport.overwritten.get(questions[1]).value, 'NOT_KNOWN');
});

test('mergeAnswers - no conflict - kept new value', t => {
    const { survey, questions, mergeReport } = createNoConflictMergeData(t);

    t.is(mergeReport.preserved.get(questions[4]).value, 2);
    t.is(mergeReport.overwritten.get(questions[4]).value, 2);
});

const createConflictMergeData = (t) => {
    const survey = new Survey(surveyData);
    const firstCategory = survey.firstCategory;
    const questions = firstCategory.questions;
    const responses1 = [5, 'NOT_KNOWN', 'NOT_UNDERSTOOD', null, null, 3].map((v, i) => ({ category: 'A', question: (i + 1), value: v })).filter(r => r.value !== null);
    const answers1 = survey.createQAMap(responses1);
    t.is(answers1.size, 4);

    const responses2 = [null, 'NOT_KNOWN', 5, 1, 2, 3].map((v, i) => ({ category: 'A', question: (i + 1), value: v })).filter(r => r.value !== null);
    const answers2 = survey.createQAMap(responses2);
    t.is(answers2.size, 5);

    const mergeReport = survey.mergeAnswers(answers1, answers2);

    return { survey, questions, mergeReport };
};

test('mergeAnswers - conflict', t => {
    const { survey, questions, mergeReport } = createConflictMergeData(t);

    t.true(mergeReport.hasConflicts);
    t.is(mergeReport.conflicts.size, 1);
    t.is(mergeReport.preserved.size, 6);
    t.is(mergeReport.overwritten.size, 6);
});

test('mergeAnswers - conflict - kept old value', t => {
    const { survey, questions, mergeReport } = createConflictMergeData(t);

    t.is(mergeReport.preserved.get(questions[0]).value, 5);
    t.is(mergeReport.overwritten.get(questions[0]).value, 5);
});

test('mergeAnswers - no conflict - kept unaltered value', t => {
    const { survey, questions, mergeReport } = createConflictMergeData(t);

    t.is(mergeReport.preserved.get(questions[1]).value, 'NOT_KNOWN');
    t.is(mergeReport.overwritten.get(questions[1]).value, 'NOT_KNOWN');
});

test('mergeAnswers - conflict - kept new value', t => {
    const { survey, questions, mergeReport } = createConflictMergeData(t);

    t.is(mergeReport.preserved.get(questions[4]).value, 2);
    t.is(mergeReport.overwritten.get(questions[4]).value, 2);
});

test('mergeAnswers - conflict - merged value is in the right place', t => {
    const { survey, questions, mergeReport } = createConflictMergeData(t);

    t.is(mergeReport.preserved.get(questions[2]).value, 'NOT_UNDERSTOOD');
    t.is(mergeReport.overwritten.get(questions[2]).value, 5);
});