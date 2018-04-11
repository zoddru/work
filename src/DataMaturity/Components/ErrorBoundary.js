import React from 'react';
import Error from './Error';
import common from '../common';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
    }

    componentDidCatch(error, info) {
        common.log.error(error, info);
        this.setState({ error });
    }

    render() {
        const { error } = this.state;
        
        if (error)
            return <Error isSubSection={this.props.isSubSection} message={`The error message is: ${error.toString()}`} />;

        return this.props.children;
    }
}