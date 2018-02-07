import PayPoint from './PayPoint';

const sumTotals = (total, pp) => total + pp.total;
const sumNextTotals = (total, pp) => total + pp.nextTotal;

export default class PayModel {
    constructor(payPoints = [], increase = 1) {

        this.message = 'pay model object';

        this.payPoints = payPoints;
        this.increase = increase;

        Object.freeze(this.payPoints);
        Object.freeze(this);
    }

    static create(payPoints, increase) {
        payPoints = payPoints
            .map(pp => Object.assign({}, pp, { increase }))
            .map(pp => new PayPoint(pp));

        return new PayModel(payPoints, increase);
    }

    get total() {
        return this.payPoints.reduce(sumTotals, 0);
    }

    get nextTotal() {
        return this.payPoints.reduce(sumNextTotals, 0);
    }

    get difference() {
        return this.nextTotal - this.total;
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return PayModel.create(props.payPoints, props.increase);
    }

    changeStaff(payPoint, staff) {
        const newValues = { staff };
        const payPoints = this.payPoints.map(pp => pp !== payPoint ? pp : pp.change(newValues));
        return PayModel.create(payPoints, this.increase);
    }

    createMultable() {
        const payModel = this;
        const proto = Object.getPrototypeOf(payModel);
        const props = Object.getOwnPropertyNames(payModel)
            .concat(Object.getOwnPropertyNames(proto))
            .filter(n => n !== 'constructor' && n !== 'increase');
        const proxy = { _original: payModel };

        props.forEach((name) => {
            Object.defineProperty(proxy, name, {
                get: function () {
                    return payModel[name];
                }
            });
        });

        Object.defineProperty(proxy, 'increase', {
            get: function () {
                return this._original.increase;
            },
            set: function (value) {
                this._original = payModel.change({ increase: value });
            }
        });

        return proxy;
    }
}