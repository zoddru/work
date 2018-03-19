import test from 'ava';
import SurveyState from './SurveyState';
import Respondent from './Respondent';

test('findConflicts - respondent changed', t => {
    const surveyState = new SurveyState({ respondent: new Respondent({ department: '10', role: 'someRole' }) });
    const newValues = { respondent: new Respondent({ department: '11', role: 'someOtherRole' }) };
    
    const conflicts = surveyState.findConflicts(newValues);

    t.is(conflicts.length, 1);
    t.is(conflicts[0].conflicts.length, 2);
});