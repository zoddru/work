import test from 'ava';
import Survey from './Survey';

const data = {
    identifier: 'DM',
    title: 'Data Maturity',
    categories: [
        {
            identifier: 'A',
            label: 'Category A',
            questions: [
                { identifier: 1, text: 'Question A.1', help: 'Help A.1' },
                { identifier: 2, text: 'Question A.2', help: 'Help A.2' },
                { identifier: 3, text: 'Question A.3', help: 'Help A.3' }
            ]
        },
        {
            identifier: 'B',
            label: 'Category B',
            questions: [
                { identifier: 1, text: 'Question B.1', help: 'Help B.1' },
                { identifier: 2, text: 'Question B.2', help: 'Help B.2' }
            ]
        }
    ]
};

test('create', t => {
    const survey = new Survey(data);

    t.is(survey.key, 'surveyDM');
    t.is(survey.identifier, 'DM');
    t.is(survey.title, 'Data Maturity');
    t.is(survey.categories.length, 2);
    t.is(survey.categories[0].key, `${survey.key}.categoryA`);
    t.is(survey.categories[1].identifier, 'B');
    t.is(survey.categories[1].label, 'Category B');
    t.is(survey.categories[0].questions.length, 3);
    t.is(survey.categories[1].questions[1].key, `${survey.key}.categoryB.question2`);
    t.is(survey.categories[1].questions[1].text, 'Question B.2');
    t.is(survey.categories[0].questions[2].help, 'Help A.3');
});

test('firstCategory', t => {
    const survey = new Survey(data);
    t.truthy(survey.firstCategory);
    t.is(survey.firstCategory, survey.categories[0]);
    t.is(survey.firstCategory.identifier, 'A');
});

test('lastCategory', t => {
    const survey = new Survey(data);
    t.truthy(survey.lastCategory);
    t.is(survey.lastCategory, survey.categories[survey.categories.length - 1]);
    t.is(survey.lastCategory.identifier, 'B');
});

test('firstQuestion', t => {
    const survey = new Survey(data);
    t.truthy(survey.firstQuestion);
    t.is(survey.firstQuestion, survey.categories[0].questions[0]);
    t.is(survey.firstQuestion.key, `surveyDM.categoryA.question1`);
});

test('lastQuestion', t => {
    const survey = new Survey(data);
    t.truthy(survey.lastQuestion);
    t.is(survey.lastQuestion, survey.categories[survey.categories.length - 1].questions[survey.categories[survey.categories.length - 1].questions.length- 1]);
    t.is(survey.lastQuestion.key, `surveyDM.categoryB.question2`);
});