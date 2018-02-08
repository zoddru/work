import React from 'react';
import PayPointRow from './PayPointRow';

export default class PayPointRows extends React.Component {
    render() {
        var rows = this.props.payPoints
            .map(pp => <PayPointRow key={pp.name} payPoint={pp} />);

        return <tbody>
            {rows}
        </tbody>;
    }
}