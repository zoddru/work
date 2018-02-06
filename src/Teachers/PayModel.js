import PayPoint from './PayPoint';

const sumTotals = (total, pp) => total + pp.total;
const sumNextTotals = (total, pp) => total + pp.nextTotal;

export default class PayModel {
    constructor(initialValues = [], increase = 1) {

        this.message = 'pay model object';

        this.increase = increase;

        this.payPoints = initialValues
            .map(pp => Object.assign({}, pp, { increase }))
            .map(pp => new PayPoint(pp));

        Object.freeze(this.payPoints);
        Object.freeze(this);
    }

    get total() {
        return this.payPoints.reduce(sumTotals, 0);
    }

    get nextTotal() {
        return this.payPoints.reduce(sumNextTotals, 0);
    }

    get difference () {
        return this.nextTotal - this.total;
    }
}