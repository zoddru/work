import test from 'ava';
import PayModel from './PayModel';

test('create', t => {
    const pm = new PayModel();

    t.truthy(pm);
    t.truthy(pm.payPoints);
    t.is(pm.payPoints.length, 0);
    t.truthy(pm.increase);
    t.is(pm.increase, 1);
});

test('total when empty', t => {
    const pm = new PayModel();
    t.is(pm.total, 0);
});

test('total', t => {
    const pm = new PayModel([{ money: 2230, staff: 3 }, { money: 4300, staff: 2 }]);
    t.is(pm.total, 15290);
});

test('next total empty model', t => {
    const pm = new PayModel();
    t.is(pm.nextTotal, 0);
});

test('next total no increase', t => {
    const pm = new PayModel([{ money: 2201, staff: 3 }, { money: 3301, staff: 2 }]);
    t.is(pm.nextTotal, 13205);
});

test('next total with increase', t => {
    const points = [{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }];
    let pm = new PayModel(points, 1);
    t.is(pm.nextTotal, 16000);

    pm = new PayModel(points, 1.5);
    t.is(pm.nextTotal, 24000);

    pm = new PayModel(points, 2);
    t.is(pm.nextTotal, 32000);
});

test('difference', t => {
    const pm = new PayModel([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    t.is(pm.difference, 8000);
});
