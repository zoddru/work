import React from 'react';

export class Pounds extends React.Component {
    render() {
        let value = this.props.value;
        if (typeof value !== 'number')
            return value;

        value = parseInt(value);

        if (isNaN(value))
            return '£-';
            
        if (value < 0) {
            value = Math.abs(value);
            if (window.Intl === undefined)
                return '-£' + parseInt(value);
            return '-£' + Intl.NumberFormat().format(parseInt(value));
        }

        if (window.Intl === undefined)
            return '£' + parseInt(value);        
        return '£' + Intl.NumberFormat().format(parseInt(value));
    }
}