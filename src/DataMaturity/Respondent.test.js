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

test('findConflicts - no values, so no conflicts', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz' });
    const conflicts = respondent.findConflicts({});

    t.is(conflicts.length, 0);
});

test('findConflicts - no old values, so no conflicts', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz' });
    const conflicts = respondent.findConflicts({ department: '1', role: 'aRole' });

    t.is(conflicts.length, 0);
});

test('findConflicts - no new values, so no conflicts', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz',  department: '1', role: 'aRole' });
    const conflicts = respondent.findConflicts({});

    t.is(conflicts.length, 0);
});

test('findConflicts - same values, no conflict', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz',  department: '1', role: 'aRole' });
    const conflicts = respondent.findConflicts({ department: '1',role: 'aRole' });

    t.is(conflicts.length, 0);
});

test('findConflicts - different department', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz',  department: '1', role: 'aRole' });
    const conflicts = respondent.findConflicts({ department: '2' });

    t.is(conflicts.length, 1);
    t.is(conflicts[0].property, 'department');
    t.is(conflicts[0].oldValue, '1');
    t.is(conflicts[0].newValue, '2');
});

test('findConflicts - different role', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz',  department: '1', role: 'aRole' });
    const conflicts = respondent.findConflicts({ role: 'anotherRole' });

    t.is(conflicts.length, 1);
    t.is(conflicts[0].property, 'role');
    t.is(conflicts[0].oldValue, 'aRole');
    t.is(conflicts[0].newValue, 'anotherRole');
});

test('findConflicts - different department and different role', t => {
    const respondent = new Respondent({ identifier: 'abc', email: 'abc@mail.com', organisation: 'xyz',  department: '1', role: 'aRole' });
    const conflicts = respondent.findConflicts({ department: '2', role: 'anotherRole' });

    t.is(conflicts.length, 2);
    const deptConflict = conflicts.find(c => c.property === 'department');
    t.is(deptConflict.oldValue, '1');
    t.is(deptConflict.newValue, '2');
    const roleConflict = conflicts.find(c => c.property === 'role');
    t.is(roleConflict.oldValue, 'aRole');
    t.is(roleConflict.newValue, 'anotherRole');
});