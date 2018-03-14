import test from 'ava';
import Respondent from './Respondent';

test('create', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz' });

    t.is(respondent.identifier, 'abc');
    t.is(respondent.email, 'abc@mail.com');
    t.is(respondent.organisation, 'xyz');
});

test('change method', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz' });

    t.is(respondent.identifier, 'abc');
    t.is(respondent.email, 'abc@mail.com');
    t.is(respondent.organisation, 'xyz');

    const newRespondent = respondent.change({ email: 'xxx@mail.co.uk' });
    
    t.is(respondent.email, 'abc@mail.com');
    t.is(newRespondent.identifier, 'abc');
    t.is(newRespondent.email, 'xxx@mail.co.uk');
    t.is(newRespondent.organisation, 'xyz');
});

test('started', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz' });

    t.falsy(respondent.department);
    t.falsy(respondent.role);

    const newRespondent = respondent.change({ email: 'xxx@mail.co.uk' });
    
    t.is(respondent.email, 'abc@mail.com');
    t.is(newRespondent.identifier, 'abc');
    t.is(newRespondent.email, 'xxx@mail.co.uk');
    t.is(newRespondent.organisation, 'xyz');
});