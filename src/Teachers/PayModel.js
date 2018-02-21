import PayPoint from './PayPoint';
import CsvWriter from '../CsvWriter';

const sumTotals = (total, pp) => total + pp.total;
const sumNextTotals = (total, pp) => total + pp.nextTotal;

export default class PayModel {
    constructor({ year = 2016, area = '', payPoints = [], percentageIncrease = 0 } = {}) {

        this.year = year;
        this.area = area;
        this.payPoints = payPoints;
        this.percentageIncrease = percentageIncrease;

        Object.freeze(this.payPoints);
        Object.freeze(this);
    }

    static create({ year = 2016, area = '', payPoints = [], percentageIncrease = 0 } = {}) {
        payPoints = payPoints
            .map(pp => Object.assign({}, pp, { percentageIncrease }))
            .map(pp => new PayPoint(pp));

        return new PayModel({ year, area, payPoints, percentageIncrease });
    }

    get total() {
        return this.payPoints.reduce(sumTotals, 0);
    }

    get nextYear() {
        return this.year + 1;
    }

    get nextTotal() {
        return this.payPoints.reduce(sumNextTotals, 0);
    }

    get difference() {
        return this.nextTotal - this.total;
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return PayModel.create(props);
    }

    changeStaff(payPoint, staff) {
        const newValues = { staff };
        const payPoints = this.payPoints.map(pp => pp !== payPoint ? pp : pp.change(newValues));
        const props = Object.assign({}, this, { payPoints });
        return PayModel.create(props);
    }

    getTable() {
        const headers = [
            'Pay point',
            this.year,
            `${this.year} FTEs`,
            `${this.year} total`,
            this.nextYear,
            `${this.nextYear} total`
        ];

        const table = [headers];

        this.payPoints.forEach(pp => {
            const row = [];
            row.push(pp.name);
            row.push(pp.money.toFixed(2));
            row.push(pp.staff);
            row.push(pp.total.toFixed(2));
            row.push(pp.nextMoney.toFixed(2));
            row.push(pp.nextTotal.toFixed(2));
            table.push(row);
        });

        return table;
    }

    getCsv() {
        const table = this.getTable();
        return new CsvWriter().write(table);
    }
}