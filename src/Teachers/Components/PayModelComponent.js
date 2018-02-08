import React from 'react';
import PayModelTable from './PayModelTable';

export default class PayModelComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { payModel: props.payModel };
    }

    changePercentageIncrease(event) {
        const percentageIncrease = parseFloat(event.target.value);
        if (this.state.payModel.percentageIncrease === percentageIncrease)
            return; // no change
        const payModel = this.state.payModel.change({ percentageIncrease });
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
                    <option>England &amp; Wales</option>
                    <option>England &amp; Wales</option>
                </select>
            </div>
            <div class="variable">
                <label for="variable-increase">Percentage increase</label>
                {/* <select id="variable-area" value={this.state.payModel.percentageIncrease.toFixed(1)} onChange={this.changePercentageIncrease.bind(this)}>
                    <option value="1.0">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2.0">2</option>
                </select> % */}
                <input id="variable-increase" type="number" step="0.5" min="1" max="2" value={this.state.payModel.percentageIncrease.toString()} onChange={this.changePercentageIncrease.bind(this)} /> %
            </div>
            <PayModelTable payModel={payModel} changeStaff={this.changeStaff.bind(this)} />
        </div>;
    }
}