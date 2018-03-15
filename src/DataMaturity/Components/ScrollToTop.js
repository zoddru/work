import React from 'react';
import { withRouter } from 'react-router';

class ScrollToTop extends React.Component {

    // componentDidMount() {
    //     const hash = this.props.location.hash;
    //     if (!hash || hash === '#')
    //         return; // we turned off auto scroll so it should render at the top

    //     const el = window.document.querySelector(hash);
    //     if (!el || !el.scrollIntoView)
    //         return;

    //     el.scrollIntoView({
    //         behavior: 'instant',
    //         block: 'start',
    //         inline: 'end'
    //     });
    // }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children
    }
}

export default withRouter(ScrollToTop);