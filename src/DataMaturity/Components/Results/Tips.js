import React from 'react';

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tips } = this.props;

        if (!tips)
            return '';

        return <div className="tips">
            <ul>
                {tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
        </div>;
    }
}