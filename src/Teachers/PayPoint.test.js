import test from 'ava';
import PayPoint from './PayPoint';
import th from '../testHelper'

test('create defaults', t => {
    const pp = new PayPoint();

    t.truthy(pp);
    t.is(pp.name, '');
    t.is(pp.money, 0);
    t.is(pp.staff, 0);
    t.is(pp.percentageIncrease, 0);
});

test('create', t => {
    const pp = new PayPoint({ name: 'm1', money: 1234, staff: 3, percentageIncrease: 2 });

    t.truthy(pp);
    t.is(pp.name, 'm1');
    t.is(pp.money, 1234);
    t.is(pp.staff, 3);
    t.is(pp.percentageIncrease, 2);
});

test('calculates total', t => {
    let pp = new PayPoint({ money: 1234, staff: 3 });
    t.is(pp.total, 3702);

    pp = new PayPoint({ money: 3333, staff: 3 });
    t.is(pp.total, 9999);

    pp = new PayPoint({ money: 3333, staff: 2 });
    t.is(pp.total, 6666);
});

test('calculates nextMoney', t => {
    let pp = new PayPoint({ money: 1234, staff: 3, percentageIncrease: 2 });
    t.true(th.isClose(pp.nextMoney, 1258.68));

    pp = new PayPoint({ money: 1000, staff: 3, percentageIncrease: 1.5 });
    t.true(th.isClose(pp.nextMoney, 1015));

    pp = new PayPoint({ money: 3333, staff: 2, percentageIncrease: 1 });
    t.is(pp.nextMoney, 3366.33);

    pp = new PayPoint({ money: 3333, staff: 2, percentageIncrease: 0 });
    t.is(pp.nextMoney, 3333);
});

test('calculates nextTotal', t => {
    let pp = new PayPoint({ money: 1234, staff: 3, percentageIncrease: 2 });
    t.true(th.isClose(pp.nextTotal, 3776.04));

    pp = new PayPoint({ money: 1000, staff: 3, percentageIncrease: 1.5 });
    t.true(th.isClose(pp.nextTotal, 3045));

    pp = new PayPoint({ money: 3333, staff: 2, percentageIncrease: 1 });
    t.true(th.isClose(pp.nextTotal, 6732.66));

    pp = new PayPoint({ money: 3333, staff: 2, percentageIncrease: 0 });
    t.is(pp.nextTotal, 6666);
});

test('change percentageIncrease', t => {
    let pp = new PayPoint({ money: 1500, staff: 3, percentageIncrease: 1 });
    pp = pp.change({ percentageIncrease: 2 });
    t.is(pp.money, 1500);
    t.is(pp.staff, 3);
    t.is(pp.percentageIncrease, 2);
});

test('changeStaff', t => {
    let pp = new PayPoint({ money: 1500, staff: 3, percentageIncrease: 1 });
    pp = pp.change({ staff: 4 })
    t.is(pp.money, 1500);
    t.is(pp.staff, 4);;
    t.is(pp.percentageIncrease, 1);
});

test('change nothing', t => {
    let pp = new PayPoint({ money: 1500, staff: 3, percentageIncrease: 1 });
    pp = pp.change({ newValue: 'newValue' })
    t.is(pp.money, 1500);
    t.is(pp.staff, 3);;
    t.is(pp.percentageIncrease, 1);
    t.is(pp.newValue, undefined);
});