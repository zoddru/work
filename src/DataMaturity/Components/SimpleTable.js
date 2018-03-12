import React from 'react';

export default class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { table, className } = this.props;

        return <table className={className}>
            <thead>
                <tr>
                    {table.headings.map((th, i) => <th key={i}>{th}</th>)}
                </tr>
            </thead>
            <tbody>
                {table.rows.map(row => <tr>
                    <th>{row.heading}</th>
                    {row.values.map((value, i) => <td key={i}>{value}</td>)}
                </tr>)}
            </tbody>
        </table>;
    }
}