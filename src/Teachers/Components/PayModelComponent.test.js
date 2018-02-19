import test from 'ava';
import jsdom from 'jsdom';
import React from 'react';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PayModelStore from '../PayModelStore';
import PayModelComponent from './PayModelComponent';
const { JSDOM } = jsdom;

configure({ adapter: new Adapter() });

const sampleData = {
    "2016": {
        "East": [
            { "name": "M1", "money": 10000, "staff": 1 },
            { "name": "M2", "money": 20000, "staff": 2 },
            { "name": "M3", "money": 30000, "staff": 3 }
        ],
        "West": [
            { "name": "N1", "money": 1000, "staff": 10 },
            { "name": "N2", "money": 2000, "staff": 20 },
            { "name": "N3", "money": 3000, "staff": 30 }  ,
            { "name": "N4", "money": 4000, "staff": 40 }            
        ]
    }    
};

const data = new PayModelStore(sampleData);
const years = [ 2016 ];
const areas = [ 'East', 'West' ]; 

test('change area', t => {

    const wrapper = mount(<PayModelComponent data={data} years={years} areas={areas} />);

    t.is(wrapper.find('#variable-area').props().value, 'East');
    t.is(wrapper.find('tbody tr').length, 3);
    wrapper.find('#variable-area').simulate('change', { target: { value: 'West' } });
    
    t.is(wrapper.find('#variable-area').props().value, 'West');
    t.is(wrapper.find('tbody tr').length, 4);
});

test('change percentage increase', t => {

    let wrapper = mount(<PayModelComponent data={data} years={years} areas={areas} />);

    t.is(wrapper.find('#variable-increase').prop('value'), '0');
    t.is(wrapper.find('.nextTotal').text(), '£140,000');

    wrapper.find('#variable-increase').simulate('change', { target: { value: '1' } });
    
    t.is(wrapper.find('#variable-increase').prop('value'), '1');
    t.is(wrapper.find('.nextTotal').text(), '£141,400');    
});

test('change staff', t => {

    let wrapper = mount(<PayModelComponent data={data} years={years} areas={areas} />);

    t.is(wrapper.find('td.number input').first().prop('value'), '1');
    t.is(wrapper.find('.total').text(), '£140,000');

    wrapper.find('td.number input').first().simulate('change', { target: { value: '0' } });
    
    t.is(wrapper.find('td.number input').first().prop('value'), '0');
    t.is(wrapper.find('.total').text(), '£130,000');   
});