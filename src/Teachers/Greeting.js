import React from 'react';

export default class Greeting extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

Greeting.defaultProps = {
    name: 'Mary'
};