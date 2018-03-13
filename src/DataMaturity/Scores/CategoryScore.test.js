import test from 'ava';
import Survey from '../Survey';
import Category from '../Category';
import CategoryScore from './CategoryScore';

const surveyData = {
    identifier: 'SURVEY',
    title: 'Survey',
    categories: [
        {
            sort: 1,
            identifier: 'CAT1',
            label: 'Category 1',
            questions: [
                {
                    identifier: 1,
                    text: 'Question 1',
                    help: '',
                    subCategory: 'SUBCAT1'
                },
                {
                    identifier: 2,
                    text: 'Question 2',
                    help: '',
                    subCategory: 'SUBCAT1'
                },
                {
                    identifier: 3,
                    text: 'Question 3',
                    help: '',
                    subCategory: 'SUBCAT1'
                },
                {
                    identifier: 4,
                    text: 'Question 4',
                    help: '',
                    subCategory: 'SUBCAT1'
                }
            ]
        }
    ]
};

test('create', t => {
    const categoryScore = new CategoryScore({});
    t.truthy(categoryScore);
});

// test('create with data', t => {
//     const survey = new Survey(surveyData);
//     const categoryScore = new CategoryScore({});
// });