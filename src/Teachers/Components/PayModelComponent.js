import React from 'react';
import PayModelTable from './PayModelTable';
import PayModel from '../PayModel';
import axios from 'axios';
import FileDownload from 'react-file-download';

export default class PayModelComponent extends React.Component {
    constructor(props) {
        super(props);

        const { data, years, areas, percentageIncrease } = props;

        Object.assign(this, { data, years, areas });

        const payModel = data.first(percentageIncrease);

        this.state = { payModel };
    }

    changeArea(event) {
        const area = event.target.value;
        const { year, percentageIncrease } = this.state.payModel;

        const payModel = this.data.get(year, area, percentageIncrease);

        this.setState({ payModel });
    }

    changePercentageIncrease(event) {
        const percentageIncrease = parseFloat(event.target.value);
        const { year, area } = this.state.payModel;

        const payModel = this.data.get(year, area, percentageIncrease);

        this.setState({ payModel });
    }

    changeStaff({ payPoint, staff }) {
        if (payPoint.staff === staff)
            return;
        const payModel = this.state.payModel.changeStaff(payPoint, staff);
        this.data.store(payModel);
        this.setState({ payModel });
    }

    downloadCsv(e) {
        // const csv = this.payModel.getCsv();
        // const encodedCsvData = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
        // window.open(encodedCsvData);

        const table = this.state.payModel.getTable();

        axios.post('/csv', table)
            .then(function (res) {
                FileDownload(res.data, 'teachers-pay.csv');
            })
            .catch(function (err) {
                console.log(err);
            });

        e.preventDefault();
    }

    render() {
        const payModel = this.state.payModel;
        const areas = this.areas.map(area => {
            return <option key={area}>{area}</option>;
        });

        const csv = payModel.getCsv();
        const encodedCsvData = encodeURI(`data:text/csv;charset=utf-8,${csv}`);

        return <form>
            <div className="variable">
                <label htmlFor="variable-area">Area</label>
                <select id="variable-area" name="area" value={payModel.area} onChange={this.changeArea.bind(this)}>
                    {areas}
                </select>
            </div>
            <div className="variable">
                <label htmlFor="variable-increase">Percentage increase</label>
                {/* <select id="variable-area" value={this.state.payModel.percentageIncrease.toFixed(1)} onChange={this.changePercentageIncrease.bind(this)}>
                    <option value="1.0">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2.0">2</option>
                </select> % */}
                <input type="number" id="variable-increase" name="percentageIncrease" step="0.5" min="1" max="2" value={this.state.payModel.percentageIncrease.toString()} onChange={this.changePercentageIncrease.bind(this)} /> %
            </div>
            <PayModelTable payModel={payModel} changeStaff={this.changeStaff.bind(this)} />
            <div>
                <a download="teachers.csv" className="button" href={encodedCsvData} onClick={this.downloadCsv.bind(this)}>Download as a CSV</a>
            </div>
        </form>;
    }
}