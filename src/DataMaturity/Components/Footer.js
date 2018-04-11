import React from 'react';
import common from '../common';

export default class Footer extends React.Component {

    setHistory(e, path) {
        e.preventDefault();
        this.props.history.push(path);
        return false;
    }
    
    render() {
        return <div class="columns">
            <div class="column">
                <a href="/disclaimer" onClick={(e) => this.setHistory(e, '/disclaimer')}>Disclaimer</a>
            </div>
            <div class="column">
                <a href="https://www.local.gov.uk/">LGA</a>
                <a href="https://www.nesta.org.uk/">Nesta</a>
                <a href="https://porism.com/">Porism</a>
                <span className="version">                    
                    {common.version}
                </span>
                <span>
                    Copyright © {new Date().getFullYear()}
                </span>
            </div>
        </div>;
    }
};