import PayModel from './PayModel';

export default class VuePayModel {
    constructor(el, payPoints) {

        let message = 'message';
        let increase = 1;
        let payModel = new PayModel(payPoints, increase);

        this.el = el;
        this.data = {
            number: 0
        }
        this.computed = {
            numberPlus1: {
                get: function () {
                    return this.number + 1;
                },
                set: function (value) {
                    this.number = parseInt(value) - 1;
                }
            },
            increase: {
                get: function () {
                    return increase;
                },
                set: function (value) {
                    increase = parseInt(value);
                    payModel = new PayModel(payPoints, increase);
                }
            }
        }
    }
}