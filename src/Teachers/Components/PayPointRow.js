import React from 'react';
import { Pounds } from './FormatComponents';

export default class PayPointRow extends React.Component {
    constructor(props) {
        super(props);
    }

    changeStaff(event) {
        const payPoint = this.props.payPoint;
        const staff = parseInt(event.target.value);
        this.props.changeStaff({ payPoint, staff });
    }

    render() {
        const payPoint = this.props.payPoint;
        const payPoints = this.props.payModel.payPoints;
        const index = payPoints.indexOf(payPoint);
        const message = index === 0 ? 'Minimum'
            : index === payPoints.length - 1 ? 'Maximum' : '';
                
        return <tr>
            <td>
                <span>{message}</span>
            </td>
            <td>{payPoint.name}</td>
            <td className="number"><Pounds value={payPoint.money} /></td>
            <td className="number"><input type="number" name={`${payPoint.name}.staff`} step="1" min="0" value={payPoint.staff.toString()} onChange={this.changeStaff.bind(this)} /></td>
            <td className="number"><Pounds value={payPoint.total} /></td>
            <td className="number"><Pounds value={payPoint.nextMoney} /></td>
            <td className="number"><Pounds value={payPoint.nextTotal} /></td>
        </tr>;
    }
}