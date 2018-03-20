import React from 'react';

export default class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { table, className } = this.props;

        const headings = table.headings.map((h, i) => <th key={i}>{typeof (h) === 'object' ? h.label : h}</th>);
        const rows = table.rows.map((row, i) => <tr key={i}>
            {row.map((v, j) => <td key={j}>{typeof (v) === 'object' ? v.label : v}</td>)}
        </tr>);

        return <table className={className}>
            <thead>
                <tr>
                    {headings}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>;
    }
}