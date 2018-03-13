import test from 'ava';
import Respondent from './Respondent';

test('create', t => {
    const respondent = new Respondent({ identifier: 'abc' });

    t.truthy(respondent);
    t.is(respondent.identifier, 'abc');
});