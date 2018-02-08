import React from 'react';

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

        return <tr>
            <td>
                <span>{payPoint.id}</span>
            </td>
            <td>{payPoint.name}</td>
            <td class="number">{payPoint.money}</td>
            <td class="number"><input type="number" step="1" min="0" max="100" value={payPoint.staff} onChange={this.changeStaff.bind(this)} /></td>
            <td class="number">{payPoint.total}</td>
            <td class="number">{payPoint.nextMoney}</td>
            <td class="number">{payPoint.nextTotal}</td>
        </tr>;
    }
}