import test from 'ava';
import React from 'react';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PayModelStore from '../PayModelStore';
import PayPointRow from './PayPointRow';
import { Pounds } from './FormatComponents';

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
            { "name": "N3", "money": 3000, "staff": 30 }            
        ]
    }    
};

const sampleStore = new PayModelStore(sampleData);
const sampleModel = sampleStore.get(2016, 'West');


const getTitleNode = (wrapper) => wrapper.childAt(1);
const getValueNode = (wrapper) => wrapper.childAt(2);
const getStaffNode = (wrapper) => wrapper.childAt(3);
const getTotalNode = (wrapper) => wrapper.childAt(4);
const getNextValueNode = (wrapper) => wrapper.childAt(5);
const getNextTotalNode = (wrapper) => wrapper.childAt(6);
   
// http://airbnb.io/enzyme/docs/api/
// https://github.com/airbnb/enzyme - shallow rendering vs full dom rendering using jsdom
// http://airbnb.io/enzyme/docs/api/ReactWrapper/simulate.html#-simulate-event-mock-self

test('create and render', t => {
    const payModel = sampleModel;
    const payPoint = payModel.payPoints[0];
    const changeStaff = () => {};
    const row = new PayPointRow({ key: payPoint.id, payPoint, payModel, changeStaff });

    t.truthy(payPoint);
    t.truthy(row);

    const result = row.render();

    const wrapper = shallow(result);
    t.true(wrapper.is('tr'));
    t.is(wrapper.children().length, 7);
    t.true(getTitleNode(wrapper).contains(<td>N1</td>));
    t.true(getValueNode(wrapper).contains(<td className="number"><Pounds value={1000} /></td>));
    t.is(getStaffNode(wrapper).find('input[value="10"]').length, 1);
    t.true(getTotalNode(wrapper).contains(<td className="number"><Pounds value={10000} /></td>)); // the total (10 * 1000)
    t.true(getNextValueNode(wrapper).contains(<td className="number"><Pounds value={1000} /></td>)); // next year's value (1000 * 1)
    t.true(getNextTotalNode(wrapper).contains(<td className="number"><Pounds value={10000} /></td>)); // next year's total (10 * 1000 * 1)
});

test('different staff number', t => {
    const payModel = sampleModel.changeStaff(sampleModel.payPoints[0], 2);
    const payPoint = payModel.payPoints[0];
    const changeStaff = () => {};
    const row = new PayPointRow({ key: payPoint.id, payPoint, payModel, changeStaff });

    t.truthy(payPoint);
    t.truthy(row);
    
    const result = row.render();

    const wrapper = shallow(result);
    t.true(wrapper.is('tr'));
    t.is(wrapper.children().length, 7);
    t.true(getTitleNode(wrapper).contains(<td>N1</td>));
    t.true(getValueNode(wrapper).contains(<td className="number"><Pounds value={1000} /></td>));
    t.is(getStaffNode(wrapper).find('input[value="10"]').length, 0);
    t.is(getStaffNode(wrapper).find('input[value="2"]').length, 1);
    t.true(getTotalNode(wrapper).contains(<td className="number"><Pounds value={2000} /></td>)); // the total (2 * 1000)
    t.true(getNextValueNode(wrapper).contains(<td className="number"><Pounds value={1000} /></td>)); // next year's value (1000 * 1)
    t.true(getNextTotalNode(wrapper).contains(<td className="number"><Pounds value={2000} /></td>)); // next year's total (2 * 1000 * 1)
});

test('different percentage increase', t => {
    const payModel = sampleModel.change({ percentageIncrease: 2 });
    const payPoint = payModel.payPoints[0];
    const changeStaff = () => {};
    const row = new PayPointRow({ key: payPoint.id, payPoint, payModel, changeStaff });

    t.truthy(payPoint);
    t.truthy(row);
    
    const result = row.render();

    const wrapper = shallow(result);
    t.true(wrapper.is('tr'));
    t.is(wrapper.children().length, 7);
    t.true(getTitleNode(wrapper).contains(<td>N1</td>));
    t.true(getValueNode(wrapper).contains(<td className="number"><Pounds value={1000} /></td>));
    t.is(getStaffNode(wrapper).find('input[value="10"]').length, 1);
    t.true(getTotalNode(wrapper).contains(<td className="number"><Pounds value={10000} /></td>)); // the total (10 * 1000)
    t.true(getNextValueNode(wrapper).contains(<td className="number"><Pounds value={1020} /></td>)); // next year's value (1000 * 1.02)
    t.true(getNextTotalNode(wrapper).contains(<td className="number"><Pounds value={10200} /></td>)); // next year's total (10 * 1000 * 1.02)
});

test('staff changed', t => {
    const payModel = sampleModel;
    const payPoint = payModel.payPoints[0];
    let hasBeenChanged = false;
    const changeStaff = () => { hasBeenChanged = true; };
    const row = new PayPointRow({ key: payPoint.id, payPoint, payModel, changeStaff });

    t.truthy(payPoint);
    t.truthy(row);
    
    const result = row.render();

    const wrapper = shallow(result);

    t.false(hasBeenChanged);
    const inputWrapper = getStaffNode(wrapper).find('input');
    inputWrapper.simulate('change', { target: { value: '5' } });
    t.true(hasBeenChanged);
});