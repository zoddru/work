export default class PayPoint {
    constructor ({ index = -1, name = '', money = 0, staff = 0, increase = { value: 1 } } = {}) {
        
        const props = { index, name, money, staff, increase };

        Object.assign(this, props);        
        Object.freeze(this);
    }

    get total() {
        return this.money * this.staff;
    }

    get nextMoney() {
        return this.money * this.increase.value;
    }

    get nextTotal() {
        return this.nextMoney * this.staff;
    }
}