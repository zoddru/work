import test from 'ava';
import PayModel from './PayModel';
import th from '../testHelper'

test('create', t => {
    const pm = new PayModel();

    t.truthy(pm);
    t.truthy(pm.payPoints);
    t.is(pm.payPoints.length, 0);
    t.is(pm.percentageIncrease, 0);
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

test('next total no percentage increase', t => {
    const pm = PayModel.create([{ money: 2201, staff: 3 }, { money: 3301, staff: 2 }]);
    t.is(pm.nextTotal, 13205);
});

test('next total with percentage increase', t => {
    const points = [{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }];
    let pm = PayModel.create(points, 0);
    t.is(pm.nextTotal, 16000);

    pm = PayModel.create(points, 1);
    t.is(pm.nextTotal, 16160);

    pm = PayModel.create(points, 1.5);
    t.true(th.isClose(pm.nextTotal, 16240));

    pm = PayModel.create(points, 2);
    t.is(pm.nextTotal, 16320);
});

test('difference', t => {
    const pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    t.true(th.isClose(pm.nextTotal, 16240));
    t.true(th.isClose(pm.difference, 240));
});

test('change percentageIncrease', t => {
    let pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }]);

    pm = pm.change({ percentageIncrease: 1 });
    t.is(pm.percentageIncrease, 1);

    pm = pm.change({ percentageIncrease: 1.5 });
    t.is(pm.percentageIncrease, 1.5);

    pm = pm.change({ percentageIncrease: 2 });
    t.is(pm.percentageIncrease, 2);
});

test('change pay points', t => {
    let pm = PayModel.create([{ money: 2000, staff: 3 }, { money: 3000, staff: 2 }, { money: 4000, staff: 1 }], 1.5);
    pm = pm.change({ payPoints: [{ money: 1000, staff: 1 }, { money: 2000, staff: 2 }] });
    t.is(pm.percentageIncrease, 1.5);
    t.is(pm.payPoints.length, 2);
    t.is(pm.payPoints[0].percentageIncrease, 1.5);
    t.is(pm.payPoints[0].money, 1000);
    t.is(pm.payPoints[0].staff, 1);
    t.is(pm.payPoints[1].percentageIncrease, 1.5);
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