import test from 'ava';
import React from 'react';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PayModelStore from '../PayModelStore';
import PayModelTable from './PayModelTable';

configure({ adapter: new Adapter() });

const sampleData = {
    "2016": {
        "East": [
            { "name": "M1", "money": 10000, "staff": 1 },
            { "name": "M2", "money": 20000, "staff": 2 }
        ],
        "West": [
            { "name": "N1", "money": 1000, "staff": 10 },
            { "name": "N2", "money": 2000, "staff": 20 },
            { "name": "N3", "money": 3000, "staff": 30 }  ,
            { "name": "N4", "money": 4000, "staff": 40 }            
        ]
    }    
};

const sampleStore = new PayModelStore(sampleData);
const sampleModel = sampleStore.get(2016, 'West');

test('create and render', t => {

    const payModel = sampleModel;
    const payPoint = sampleModel.payPoints[0];
    const changeStaff = () => {};
    const table = new PayModelTable({ payModel, changeStaff });

    t.truthy(payPoint);
    t.truthy(table);

    const result = table.render();
    
    // http://airbnb.io/enzyme/docs/api/
    // https://github.com/airbnb/enzyme - shallow rendering vs full dom rendering using jsdom

    const wrapper = shallow(result);
    t.true(wrapper.is('table'));
    t.is(wrapper.children().length, 3);

    const theadWrapper = wrapper.childAt(0);
    t.true(theadWrapper.is('thead'));
    t.is(theadWrapper.children().length, 1); // thead > tr

    const tbodyWrapper = wrapper.childAt(1);
    t.true(tbodyWrapper.is('tbody'));
    t.is(tbodyWrapper.children().length, 4); // tbody > tr
});