import test from 'ava';
import Survey from '../Survey';
import ResponseAggregator from './ResponseAggregator';
import util from 'util';

{
    const surveyData = require('../Testing/surveyData.3.json');
    const survey = new Survey(surveyData);
    const responses = require('../Testing/responses.3.json');
    const scoreAggregator = new ResponseAggregator({ survey, responses });

    test('score has label and identifier', t => {
        const score = scoreAggregator.byCategory({
            key: { type: 'respondent' },
            filter: r => r.respondent.identifier === '1a33f4bb-8a7a-4447-9808-9f1199ff2dc4'
        });

        t.truthy(score.key);
        t.truthy(score.key.filter);
        t.is(score.key.filter.type, 'respondent');
    });

    test('get multiple returns a result', t => {
        const scores = scoreAggregator.multipleByCategory([
            {
                key: { type: 'respondent' },
                filter: r => r.respondent.identifier === '1a33f4bb-8a7a-4447-9808-9f1199ff2dc4'
            }
        ]);

        t.is(scores.length, 1);

        const score = scores[0];
        t.truthy(score.key);
        t.truthy(score.key.filter);
        t.is(score.key.filter.type, 'respondent');
    });

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
            key: { type: 'respondent' },
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

    test('simplified - can be stringify for serialization', t => {
        
        const { score, lookup } = getToResponentsResults();
        const simplified = score.simplified;

        t.notThrows(() => JSON.stringify(simplified));
    });

    test('simplified - values look correct', t => {
        
        const { score, lookup } = getToResponentsResults();
        const simplified = score.simplified;

        t.is(simplified.numberOfValid, score.numberOfValid);
        t.is(simplified.sum, score.sum);
        
        t.truthy(simplified.key);
        t.is(simplified.key, score.key);

        t.truthy(simplified.categoryScores);
        t.is(simplified.categoryScores.length, score.categoryScores.length);
        
        for (let i = 0; i < score.categoryScores.length; i += 1) {
            t.is(simplified.categoryScores[i].numberNotKnown, score.categoryScores[i].numberNotKnown);
            t.is(simplified.categoryScores[i].numberNotUnderstood, score.categoryScores[i].numberNotUnderstood);
            t.is(simplified.categoryScores[i].numberOfValid, score.categoryScores[i].numberOfValid);
            t.is(simplified.categoryScores[i].sum, score.categoryScores[i].sum);
            t.is(simplified.categoryScores[i].sum, score.categoryScores[i].sum);
            const simplifiedCategory = simplified.categoryScores[i].category;
            const category = score.categoryScores[i].category;
            t.truthy(simplifiedCategory);
            t.is(simplifiedCategory.identifier, category.identifier);
            t.is(simplifiedCategory.survey.identifier, category.survey.identifier);
        }
    });

    test('simplified - can convert back to proper object', t => {

        const { score, lookup } = getToResponentsResults();
        const simplified = score.simplified;

        const unsimplified = scoreAggregator.unsimplify(simplified);

        t.truthy(unsimplified);

        t.is(unsimplified.numberOfValid, score.numberOfValid);
        t.is(unsimplified.sum, score.sum);
        
        t.truthy(unsimplified.key);
        t.is(unsimplified.key.toString(), score.key.toString());

        t.truthy(unsimplified.categoryScores);
        t.is(unsimplified.categoryScores.length, score.categoryScores.length);
        
        for (let i = 0; i < score.categoryScores.length; i += 1) {
            t.is(unsimplified.categoryScores[i].numberNotKnown, score.categoryScores[i].numberNotKnown);
            t.is(unsimplified.categoryScores[i].numberNotUnderstood, score.categoryScores[i].numberNotUnderstood);
            t.is(unsimplified.categoryScores[i].numberOfValid, score.categoryScores[i].numberOfValid);
            t.is(unsimplified.categoryScores[i].sum, score.categoryScores[i].sum);
            t.is(unsimplified.categoryScores[i].sum, score.categoryScores[i].sum);
            t.is(unsimplified.categoryScores[i].category, score.categoryScores[i].category);

            // the real test:
            t.true(unsimplified.categoryScores[i] instanceof score.categoryScores[i].constructor);
            t.is(unsimplified.categoryScores[i].mean, score.categoryScores[i].mean);
        }

        // the real test:
        t.true(unsimplified instanceof score.constructor);
        t.is(unsimplified.mean, score.mean);
    });
}