export default class PayPoint {
    constructor ({ name = '', money = 0, staff = 0, percentageIncrease = 0 } = {}) {
        
        staff = (isNaN(staff)) ? 0 : staff;

        const props = { name, money, staff, percentageIncrease };

        Object.assign(this, props);        
        Object.freeze(this);
    }

    get id() {
        return this.name;
    }

    get total() {
        return this.money * this.staff;
    }

    get multiplier() {
        return (1 + this.percentageIncrease / 100);
    }

    get nextMoney() {
        return this.money * this.multiplier;
    }

    get nextTotal() {
        return this.nextMoney * this.staff;
    }

    change(newValues) {
        const props = Object.assign({}, this, newValues);
        return new PayPoint(props);
    }
}