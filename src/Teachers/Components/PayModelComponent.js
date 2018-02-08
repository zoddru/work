import React from 'react';
import PayModelTable from './PayModelTable';

export default class PayModelComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { payModel: props.payModel };

        this.changeIncrease = this.changeIncrease.bind(this);
    }

    changeIncrease(event) {
        const increase = parseFloat(event.target.value);
        if (this.state.payModel.increase === increase)
            return; // no change
        const payModel = this.state.payModel.change({ increase });
        this.setState({ payModel });
    }

    changeStaff({ payPoint, staff }) {
        if (payPoint.staff === staff)
            return;
        const payModel = this.state.payModel.changeStaff(payPoint, staff);
        this.setState({ payModel });
    }

    render() {
        const payModel = this.state.payModel;

        return <div>
            <div class="variable">
                <label for="variable-area">Area</label>
                <select id="variable-area">
                    <option>England &amp; Wales</option>
                </select>
            </div>
            <div class="variable">
                <label for="variable-increase">Percentage increase</label>
                <input id="variable-increase" type="number" step="0.5" min="1" max="2" value={this.state.payModel.increase.toString()} onChange={this.changeIncrease} /> %
            </div>
            <PayModelTable payModel={payModel} changeStaff={this.changeStaff.bind(this)} />
        </div>;
    }
}