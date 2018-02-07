import test from 'ava';
import PayPoint from './PayPoint';

test('create defaults', t => {
    const pp = new PayPoint();

    t.truthy(pp);
    t.is(pp.name, '');
    t.is(pp.money, 0);
    t.is(pp.staff, 0);
    t.is(pp.increase, 1);
});

test('create', t => {
    const pp = new PayPoint({ name: 'm1', money: 1234, staff: 3, increase: 2 });

    t.truthy(pp);
    t.is(pp.name, 'm1');
    t.is(pp.money, 1234);
    t.is(pp.staff, 3);
    t.is(pp.increase, 2);
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
    let pp = new PayPoint({ money: 1234, staff: 3, increase: 2 });
    t.is(pp.nextMoney, 2468);

    pp = new PayPoint({ money: 1000, staff: 3, increase: 1.5 });
    t.is(pp.nextMoney, 1500);

    pp = new PayPoint({ money: 3333, staff: 2, increase: 1 });
    t.is(pp.nextMoney, 3333);
});

test('calculates nextMoney when increase changed', t => {
    let pp = new PayPoint({ money: 1000, staff: 3, increase: 2 });
    t.is(pp.nextMoney, 2000);

    pp = new PayPoint({ money: 1000, staff: 3, increase: 1.5 });
    t.is(pp.nextMoney, 1500);

    pp = new PayPoint({ money: 1000, staff: 3, increase: 1 });
    t.is(pp.nextMoney, 1000);
});

test('calculates nextTotal', t => {
    let pp = new PayPoint({ money: 1234, staff: 3, increase: 2 });
    t.is(pp.nextTotal, 7404);

    pp = new PayPoint({ money: 1000, staff: 3, increase: 1.5 });
    t.is(pp.nextTotal, 4500);

    pp = new PayPoint({ money: 3333, staff: 2, increase: 1 });
    t.is(pp.nextTotal, 6666);
});

test('calculates nextTotal when increase changed', t => {
    let pp = new PayPoint({ money: 1500, staff: 3, increase: 1 });
    t.is(pp.nextTotal, 4500);

    pp = new PayPoint({ money: 1500, staff: 3, increase: 1.5 });
    t.is(pp.nextTotal, 6750);

    pp = new PayPoint({ money: 1500, staff: 3, increase: 2 });
    t.is(pp.nextTotal, 9000);
});

test('changeIncrease', t => {
    let pp = new PayPoint({ money: 1500, staff: 3, increase: 1 });
    pp = pp.change({ increase: 2 });
    t.is(pp.money, 1500);
    t.is(pp.staff, 3);
    t.is(pp.increase, 2);
});

test('changeStaff', t => {
    let pp = new PayPoint({ money: 1500, staff: 3, increase: 1 });
    pp = pp.change({ staff: 4 })
    t.is(pp.money, 1500);
    t.is(pp.staff, 4);;
    t.is(pp.increase, 1);
});

test('change nothing', t => {
    let pp = new PayPoint({ money: 1500, staff: 3, increase: 1 });
    pp = pp.change({ newValue: 'newValue' })
    t.is(pp.money, 1500);
    t.is(pp.staff, 3);;
    t.is(pp.increase, 1);
    t.is(pp.newValue, undefined);
});