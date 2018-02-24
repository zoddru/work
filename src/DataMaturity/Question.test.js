import test from 'ava';
import Question from './Question';

const section = Object.freeze({ key: 'sectionA' });

test('create', t => {
    const q = new Question({ section, identifier: '10', text: 'a question?', help: 'some help' });

    t.truthy(q);
    t.is(q.section, section);
    t.is(q.identifier, '10');
    t.is(q.text, 'a question?');
    t.is(q.help, 'some help');
    t.is(q.answers.length, Question.defaultAnswers.length);
    t.is(q.key, `${section.key}.question10`);

    Question.defaultAnswers.forEach((a, i) => {
        t.is(q.answers[i], a);
    });
});

const data = [
    { text: 'Question 1?', help: 'Help 1' },
    { text: 'Question 2?', help: 'Help 2' },
    { text: 'Question 3?', help: 'Help 3' }
];

test('create array', t => {
    const questions = Question.createArray(section, data);

    t.truthy(questions);
    t.is(questions.length, data.length);
    t.is(questions[1].identifier, '2');
    t.is(questions[2].text, 'Question 3?');
    t.is(questions[0].help, 'Help 1');
    t.is(questions[1].key, `${section.key}.question2`);
});