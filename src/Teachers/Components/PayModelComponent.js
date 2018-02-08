import React from 'react';
import PayModelTable from './PayModelTable';
import PayModel from '../PayModel';

export default class PayModelComponent extends React.Component {
    constructor(props) {
        super(props);

        const data = props.data;
        const years = Object.keys(data);
        const year = parseInt(years[0]);
        const yearsData = data[year.toString()];
        const areas = Object.keys(yearsData);
        const area = areas[0];
        const percentageIncrease = 1;
        const payPoints = data[year][area];
        const payModel = PayModel.create({ year, area, payPoints, percentageIncrease });

        Object.assign(this, { data, years, areas });
        
        this.cache = {};
        this.cachePayModel(payModel);

        this.state = { payModel };
    }

    cachePayModel(payModel) {
        let { year, area, percentageIncrease } = payModel;
        const cache = this.cache;
        year = year.toString();
        if (!cache[year]) {
            cache[year] = {};
        }
        cache[year][area] = payModel;
    }

    getCachedPayModel(year, area) {
        const cache = this.cache;
        year = year.toString();
        return (cache[year] && cache[year][area]) ? cache[year][area] : null;
    }

    changeArea(event) {
        const area = event.target.value;
        const { year, percentageIncrease } = this.state.payModel;

        let payModel = this.getCachedPayModel(year, area);

        if (!payModel) {
            const payPoints = this.data[year][area];
            payModel = PayModel.create({ year, area, payPoints, percentageIncrease });
        }
        
        if (payModel.percentageIncrease === percentageIncrease) {
            this.cachePayModel(payModel);
            this.setState({ payModel });
            return ;
        }

        payModel = payModel.change({ percentageIncrease });
        this.cachePayModel(payModel);
        this.setState({ payModel });
    }

    changePercentageIncrease(event) {
        const percentageIncrease = parseFloat(event.target.value);
        if (this.state.payModel.percentageIncrease === percentageIncrease)
            return; // no change
        const payModel = this.state.payModel.change({ percentageIncrease });
        this.cachePayModel(payModel);
        this.setState({ payModel });
    }

    changeStaff({ payPoint, staff }) {
        if (payPoint.staff === staff)
            return;
        const payModel = this.state.payModel.changeStaff(payPoint, staff);
        this.cachePayModel(payModel);
        this.setState({ payModel });
    }

    render() {
        const payModel = this.state.payModel;
        const areas = this.areas.map(area => {
            return <option key={area}>{area}</option>;
        });

        return <div>
            <div class="variable">
                <label for="variable-area">Area</label>
                <select id="variable-area" value={this.state.area} onChange={this.changeArea.bind(this)}>
                    {areas}
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