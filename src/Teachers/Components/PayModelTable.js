import React from 'react';
import PayPointRow from './PayPointRow';
import { Pounds } from './FormatComponents';

export default class PayModelTable extends React.Component {
    constructor (props) {
        super(props);
    }
    
    render() {
        const payModel = this.props.payModel;
        const changeStaff = this.props.changeStaff;

        const rows = payModel.payPoints
            .map(pp => <PayPointRow key={pp.id} payPoint={pp} payModel={payModel} changeStaff={changeStaff} />);

        return <table>
            <thead>
                <tr>
                    <th colSpan="2">Pay point</th>
                    <th>2016</th>
                    <th>2016 FTEs</th>
                    <th>2016 total</th>
                    <th>2017</th>
                    <th>2017 total</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan="2">Totals</th>
                    <td></td>
                    <td></td>
                    <td class="number"><Pounds value={payModel.total} /></td>
                    <td></td>
                    <td class="number"><Pounds value={payModel.nextTotal} /></td>
                </tr>
            </tfoot>
        </table>;
    }
}