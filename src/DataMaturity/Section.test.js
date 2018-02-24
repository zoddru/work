import test from 'ava';
import Section from './Section';

const survey = Object.freeze({ key: 'surveyA' });
const questionData = [
    { text: 'Question 1?', help: 'Help 1' },
    { text: 'Question 2?', help: 'Help 2' },
    { text: 'Question 3?', help: 'Help 3' }
];

test('create', t => {
    const s = new Section({ survey, identifier: 'A', title: 'Section A', questionData });

    t.truthy(s);
    t.is(s.survey, survey);
    t.is(s.identifier, 'A');
    t.is(s.title, 'Section A');
    t.is(s.key, `${survey.key}.sectionA`);

    t.is(s.questions.length, 3);

    t.is(s.questions[1].key, `${s.key}.question2`);
});

const data = [
    {
        identifier: 'A',
        title: 'Section A',
        questions: [
            { text: 'Question A1?', help: 'Help A1' },
            { text: 'Question A2?', help: 'Help A2' },
            { text: 'Question A3?', help: 'Help A3' }
        ]
    },
    {
        identifier: 'B',
        title: 'Section B',
        questions: [
            { text: 'Question B1?', help: 'Help B1' },
            { text: 'Question B2?', help: 'Help B2' }
        ]
    }
];

test('create array', t => {
    const sections = Section.createArray(survey, data);

    t.truthy(sections);
    t.is(sections.length, data.length);
    t.is(sections[0].identifier, 'A');
    t.is(sections[1].title, 'Section B');
    t.is(sections[0].questions.length, 3);
    t.is(sections[1].questions[1].text, 'Question B2?');
    t.is(sections[0].questions[2].help, 'Help A3');
});