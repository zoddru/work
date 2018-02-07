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
    const pm = PayModel.create([{ money: 2230, staff: 3 }, { money: 4300, staff: 2 }]);
    t.is(pm.total, 15290);
});

test('next total empty model', t => {
    const pm = new PayModel();
    t.is(pm.nextTotal, 0);
});

test('next total no increase', t => {
    const pm = PayModel.create([{ money: 2201, staff: 3 }, { money: 3301, staff: 2 }]);
    t.is(pm.nextTotal, 13205);
});

test('next total with increase', t => {
    const points = [{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }];
    let pm = PayModel.create(points, 1);
    t.is(pm.nextTotal, 16000);

    pm = PayModel.create(points, 1.5);
    t.is(pm.nextTotal, 24000);

    pm = PayModel.create(points, 2);
    t.is(pm.nextTotal, 32000);
});

test('difference', t => {
    const pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    t.is(pm.difference, 8000);
});

test('change increase', t => {
    let pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    pm = pm.change({ increase: 2 });
    t.is(pm.increase, 2);
    t.is(pm.payPoints.length, 3);
    t.is(pm.payPoints[0].increase, 2);
    t.is(pm.payPoints[1].increase, 2);
    t.is(pm.payPoints[2].increase, 2);
});

test('change pay points', t => {
    let pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    pm = pm.change({ payPoints: [{ money: 1000, staff: 1 }, { money: 2000, staff: 2 }] });
    t.is(pm.increase, 1.5);
    t.is(pm.payPoints.length, 2);
    t.is(pm.payPoints[0].increase, 1.5);
    t.is(pm.payPoints[0].money, 1000);
    t.is(pm.payPoints[0].staff, 1);
    t.is(pm.payPoints[1].increase, 1.5);
    t.is(pm.payPoints[1].money, 2000);
    t.is(pm.payPoints[1].staff, 2);
});

test('change staff count', t => {
    let pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    pm = pm.changeStaff(pm.payPoints[1], 13);
    t.is(pm.payPoints.length, 3);
    t.is(pm.payPoints[0].staff, 3);
    t.is(pm.payPoints[1].staff, 13);
    t.is(pm.payPoints[2].staff, 1);
});

test('create getMutable', t => {
    let pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    
    t.is(pm.increase, 1.5);

    let mpm = pm.createMultable();

    t.is(mpm.increase, 1.5);
    mpm.increase = 10;

    t.is(mpm.increase, 10);
});