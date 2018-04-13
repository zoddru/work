import React from 'react';
import { withRouter } from 'react-router';
import { debug } from 'util';

const scrollIntoView = (target) => {
    target.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'end'
    });
};

class ScrollToHash extends React.Component {

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname === prevProps.location.pathname)
            return;

        const id = (window.location.hash).substring(1);
        if (!id) {
            window.scrollTo(0, 0);
            return;
        }
            
        const target = window.document.getElementById(id);
        if (target) {
            scrollIntoView(target); // the default behaviour does not work when switching between two tabs that have similar elements with different content
            return;
        }

        window.scrollTo(0, 0);
    }

    render() {
        return this.props.children
    }
}

export default withRouter(ScrollToHash);