export default class PayPoint {
    constructor ({ name = '', money = 0, staff = 0, increase = 1 } = {}) {
        
        const props = { name, money, staff, increase };

        Object.assign(this, props);        
        Object.freeze(this);
    }

    get total() {
        return this.money * this.staff;
    }

    get nextMoney() {
        return this.money * this.increase;
    }

    get nextTotal() {
        return this.nextMoney * this.staff;
    }
}