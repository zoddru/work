import test from 'ava';
import PayModel from './PayModel';
import PayModelStore from './PayModelStore';
import th from '../testHelper'

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

const samplePayModel = PayModel.create({ year: 2016, area: 'West', payPoints: sampleData['2016'].West, percentageIncrease: 14 });

test('create', t => {
    const pms = new PayModelStore();

    t.truthy(pms);
});

test('get', t => {
    const pms = new PayModelStore(sampleData);

    let payModel = pms.get(2016, 'East');

    t.truthy(payModel);
    t.is(payModel.area, 'East');
    t.is(payModel.year, 2016);
    t.is(payModel.percentageIncrease, 0);
    t.truthy(payModel.payPoints);
    t.is(payModel.payPoints.length, 2);
    t.truthy(payModel.payPoints[1]);
    t.is(payModel.payPoints[1].name, 'M2');
    t.is(payModel.payPoints[1].money, 20000);
    t.is(payModel.payPoints[1].staff, 2);

    payModel = pms.get(2016, 'West');

    t.truthy(payModel);
    t.is(payModel.area, 'West');
    t.is(payModel.year, 2016);
    t.is(payModel.percentageIncrease, 0);
    t.truthy(payModel.payPoints);
    t.is(payModel.payPoints.length, 3);
    t.truthy(payModel.payPoints[1]);
    t.is(payModel.payPoints[1].name, 'N2');
    t.is(payModel.payPoints[1].money, 2000);
    t.is(payModel.payPoints[1].staff, 20);
});

test('store', t => {
    const pms = new PayModelStore();

    pms.store(samplePayModel);

    const payModel = pms.get(2016, 'West');
    t.is(payModel, samplePayModel);
});

test('get with same percentage increase', t => {
    const pms = new PayModelStore();

    pms.store(samplePayModel);

    const payModel = pms.get(2016, 'West', 14);
    t.is(payModel, samplePayModel);
});

test('get with different percentage increase', t => {
    const pms = new PayModelStore();

    pms.store(samplePayModel);

    const payModel = pms.get(2016, 'West', 15);
    t.not(payModel, samplePayModel);

    t.is(payModel.year, samplePayModel.year);
    t.is(payModel.area, samplePayModel.area);
    t.is(payModel.payPoints.length, samplePayModel.payPoints.length);
    t.is(payModel.percentageIncrease, 15);

    payModel.payPoints.forEach(pp => t.is(pp.percentageIncrease, 15));
});

test('get first', t => {
    const pms = new PayModelStore(sampleData);

    const payModel = pms.first();

    t.truthy(payModel);

    t.is(payModel.year, 2016);
    t.is(payModel.area, 'East');
    t.is(payModel.payPoints.length, 2);
    t.is(payModel.percentageIncrease, 0);
});