import test from 'ava';
import Survey from '../Survey';
import Respondent from '../Respondent';
import SurveyScore from './SurveyScore';

{
    const surveyData = require('../Testing/surveyData.1.json');
    const survey = new Survey(surveyData);
    const responsesData = require('../Testing/responses.1.json');
    const respondentData = responsesData.respondent;
    const respondent = new Respondent(respondentData);
    const responses = responsesData.responses;
    const answers = survey.createQAMap(responses);

    test('check invalid mean', t => {
        const score = new SurveyScore({ survey, respondent, answers });

        t.is(score.numberOfValid, 2);
        t.false(score.isValid);
        t.is(score.mean, (3 + 4) / 2);
    });
}

{
    const surveyData = require('../Testing/surveyData.2.json');
    const survey = new Survey(surveyData);
    const responsesData = require('../Testing/responses.2.json');
    const respondentData = responsesData.respondent;
    const respondent = new Respondent(respondentData);
    const responses = responsesData.responses;
    const answers = survey.createQAMap(responses);

    test('check valid mean', t => {
        const score = new SurveyScore({ survey, respondent, answers });

        t.true(score.categoryScores[0].isValid);
        t.true(score.categoryScores[1].isValid);
        t.true(score.categoryScores[2].isValid);
        t.true(score.categoryScores[3].isValid);
        t.true(score.isValid);

        t.is(score.categoryScores.length, 4);
        t.is(score.categoryScores[0].mean, (4 * 5 + 4) / 5);
        t.is(score.categoryScores[1].mean, (4 * 4 + 3) / 5);
        t.is(score.categoryScores[2].mean, (4 * 3 + 2) / 5);
        t.is(score.categoryScores[3].mean, (4 * 2 + 1) / 5);

        const mean = (((4 * 5 + 4) + (4 * 4 + 3) + (4 * 3 + 2) + (4 * 2 + 1)) / 5) / 4;
        t.is(score.mean, mean);
    });
}