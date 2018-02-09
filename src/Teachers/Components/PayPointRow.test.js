import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PayModelStore from '../PayModelStore';
import PayModel from '../PayModel';
import PayPoint from '../PayPoint';
import PayPointRow from './PayPointRow';
import th from '../../testHelper';

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
const samplePoint = sampleModel.payPoints[0];

test('create and render', t => {

    const payModel = sampleModel;
    const payPoint = samplePoint;
    const changeStaff = () => {};
    const row = new PayPointRow({ key: payPoint.id, payPoint, payModel, changeStaff });

    t.truthy(payPoint);
    t.truthy(row);

    const result = row.render();

    
    // http://airbnb.io/enzyme/docs/api/

    const wrapper = shallow(result);
    t.true(wrapper.is('tr'));
    t.true(wrapper.contains(<td>N1</td>));
});