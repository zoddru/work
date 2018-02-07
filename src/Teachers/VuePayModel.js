import PayModel from './PayModel';

export default class VuePayModel {
    constructor(el, payPoints) {

        this.el = el;

        const payModel = PayModel.create(payPoints, 1);
        this.data = { payModel };

        const model = this;
        this.computed = {
            increase: {
                get: function() {
                    return this.payModel.increase;
                },
                set: function(value) {
                    this.payModel = this.payModel.change({ increase: parseFloat(value) });
                }
            },

            payPoints: {
                get: function() {
                    return this.payModel.payPoints;
                }
            },

            total: {
                get: function() {
                    return this.payModel.total;
                }
            },

            nextTotal: {
                get: function() {
                    return this.payModel.nextTotal;
                }
            },

            difference: {
                get: function() {
                    return this.payModel.difference;
                }
            }
        }

        this.methods = {
            changeStaff: function (payPoint, staff) {
                this.payModel = this.payModel.changeStaff(payPoint, parseInt(staff));
            }
        }
    }
}