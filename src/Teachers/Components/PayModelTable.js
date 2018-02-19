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
                    <th>{payModel.year}</th>
                    <th>{payModel.year} FTEs</th>
                    <th>{payModel.year} total</th>
                    <th>{payModel.nextYear}</th>
                    <th>{payModel.nextYear} total</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan="2">Total</th>
                    <td></td>
                    <td></td>
                    <td className="number total"><Pounds value={payModel.total} /></td>
                    <td></td>
                    <td className="number nextTotal"><Pounds value={payModel.nextTotal} /></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <th>Difference</th>
                    <td className="number difference"><Pounds value={payModel.difference} /></td>
                </tr>
            </tfoot>
        </table>;
    }
}