import test from 'ava';
import React from 'react';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Pounds } from './FormatComponents';

configure({ adapter: new Adapter() });

test('less than 1,000', t => {
    const pounds = new Pounds({ value: 100 });
    const result = pounds.render();
    t.is(result, '£100');
});

test('more than 1,000', t => {
    const pounds = new Pounds({ value: 1000 });
    const result = pounds.render();
    t.is(result, '£1,000');
});

test('more than 1,000,000', t => {
    const pounds = new Pounds({ value: 1000000 });
    const result = pounds.render();
    t.is(result, '£1,000,000');
});

test('zero', t => {
    const pounds = new Pounds({ value: 0 });
    const result = pounds.render();
    t.is(result, '£0');
});

test('less than zero', t => {
    const pounds = new Pounds({ value: -100 });
    const result = pounds.render();
    t.is(result, '-£100');
});

test('less than -1,000,000', t => {
    const pounds = new Pounds({ value: -1000000 });
    const result = pounds.render();
    t.is(result, '-£1,000,000');
});

test('just pounds', t => {
    const pounds = new Pounds({ value: 0.234 });
    const result = pounds.render();
    t.is(result, '£0');
});

test('just pounds positive', t => {
    const pounds = new Pounds({ value: 1234567.89 });
    const result = pounds.render();
    t.is(result, '£1,234,567');
});

test('just pounds negative', t => {
    const pounds = new Pounds({ value: -1234567.89 });
    const result = pounds.render();
    t.is(result, '-£1,234,567');
});