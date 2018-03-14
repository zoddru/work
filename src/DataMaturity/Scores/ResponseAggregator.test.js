import test from 'ava';
import Survey from '../Survey';
import ResponseAggregator from './ResponseAggregator';

{
    const surveyData = require('../Testing/surveyData.3.json');
    const survey = new Survey(surveyData);
    const responses = require('../Testing/responses.3.json');
    const scoreAggregator = new ResponseAggregator({ survey, responses });

    test('single respondent', t => {
        const score = scoreAggregator.byCategory({
            identifier: 'just 1a33f4bb-8a7a-4447-9808-9f1199ff2dc4',
            label: 'respondent 1a33f4bb-8a7a-4447-9808-9f1199ff2dc4',
            filter: r => r.respondent.identifier === '1a33f4bb-8a7a-4447-9808-9f1199ff2dc4'
        });

        const lookup = score.categoryScores.reduce((obj, cs) => { obj[cs.category.identifier] = cs; return obj; }, {});

        t.true(lookup.Management.hasMean);
        t.true(lookup.Management.isValid);
        t.is(lookup.Management.mean, 3.75); // (5, 3, 4, 3 = 15) / 4

        t.true(lookup.Use.hasMean);
        t.false(lookup.Use.isValid);
        t.is(lookup.Use.mean, 3); // (4 + 2)

        t.true(lookup.Governance.hasMean);
        t.true(lookup.Governance.isValid);
        t.is(lookup.Governance.mean, 2.25);

        t.false(lookup.Skills.hasMean);
        t.false(lookup.Skills.isValid);

        t.false(lookup.Culture.hasMean);
        t.false(lookup.Culture.isValid);

        // overall

        t.truthy(score.mean);
        t.is(score.mean, (3.75 + 2.25) / 2);
        t.is(score.categoryScores.length, 5);
        t.is(score.numberOfValid, 2);
        t.false(score.isValid);
    });


    const getToResponentsResults = () => {
        const score = scoreAggregator.byCategory({
            identifier: 'aggregator identifier',
            label: 'aggregator label',
            filter: r => r.respondent.identifier === '1a33f4bb-8a7a-4447-9808-9f1199ff2dc4' || r.respondent.identifier === '48c292a1-c8f6-4df0-9576-68bacee119bc'
        });

        const lookup = score.categoryScores.reduce((obj, cs) => { obj[cs.category.identifier] = cs; return obj; }, {});

        return { score, lookup };
    };

    test('two respondents - average valid results', t => {
        
        const { score, lookup } = getToResponentsResults();
        
        t.truthy(score.mean);

        t.is(lookup.Management.numberOfValid, 7); // 4 + 3
        t.is(lookup.Management.mean, (3.75 * 4 + 4 * 3) / 7); // weighted averages
        t.is(lookup.Use.numberOfValid, 6);
        t.is(lookup.Governance.numberOfValid, 8);
        t.is(lookup.Governance.mean, (2.25 * 4 + 5 * 4) / 8);
    });

    test('two respondents - overall invalid results are still counted when summing', t => {
        
        const { score, lookup } = getToResponentsResults();

        t.is(lookup.Use.mean, (3 * 2 + 5 * 4) / 6);
        t.true(lookup.Use.isValid);
    });

    test('two respondents - one respondent has no answers, does not affect average', t => {
        
        const { score, lookup } = getToResponentsResults();

        t.is(lookup.Skills.numberOfValid, 4);
        t.is(lookup.Skills.mean, 5);
        t.true(lookup.Skills.isValid);
    });

    test('two respondents - no answers, score is invalid', t => {
        
        const { score, lookup } = getToResponentsResults();
        
        t.is(lookup.Culture.numberOfValid, 0);
        t.false(lookup.Culture.isValid);
        t.false(lookup.Culture.hasMean);
    });
}