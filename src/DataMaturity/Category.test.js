import test from 'ava';
import Category from './Category';

const survey = Object.freeze({ key: 'surveyA' });
const questionData = [
    { text: 'Question 1?', help: 'Help 1' },
    { text: 'Question 2?', help: 'Help 2' },
    { text: 'Question 3?', help: 'Help 3' }
];

test('create', t => {
    const s = new Category({ survey, identifier: 'A', label: 'Category A', questionData });

    t.truthy(s);
    t.is(s.survey, survey);
    t.is(s.identifier, 'A');
    t.is(s.label, 'Category A');
    t.is(s.key, `${survey.key}.categoryA`);

    t.is(s.questions.length, 3);

    t.is(s.questions[1].key, `${s.key}.question2`);
});

const data = [
    {
        identifier: 'A',
        label: 'Category A',
        questions: [
            { text: 'Question A1?', help: 'Help A1' },
            { text: 'Question A2?', help: 'Help A2' },
            { text: 'Question A3?', help: 'Help A3' }
        ]
    },
    {
        identifier: 'B',
        label: 'Category B',
        questions: [
            { text: 'Question B1?', help: 'Help B1' },
            { text: 'Question B2?', help: 'Help B2' }
        ]
    }
];

test('create array', t => {
    const categories = Category.createArray(survey, data);

    t.truthy(categories);
    t.is(categories.length, data.length);
    t.is(categories[0].identifier, 'A');
    t.is(categories[1].label, 'Category B');
    t.is(categories[0].questions.length, 3);
    t.is(categories[1].questions[1].text, 'Question B2?');
    t.is(categories[0].questions[2].help, 'Help A3');
});