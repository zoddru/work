import React from 'react';

export class Pounds extends React.Component {
    render() {
        const value = this.props.value;
        if (typeof value !== 'number')
            return value;
        if (window.Intl === undefined)
            return '£' + parseInt(value);
        if (isNaN(value))
            return '£-';
        return '£' + Intl.NumberFormat().format(parseInt(value));
    }
}