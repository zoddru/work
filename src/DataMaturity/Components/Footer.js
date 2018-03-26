import React from 'react';

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
                <a href="/cookies" onClick={(e) => this.setHistory(e, '/cookies')}>Cookie policy</a>
                <a href="/privacy" onClick={(e) => this.setHistory(e, '/privacy')}>Privacy policy</a>
            </div>
            <div class="column">
                <a href="https://porism.com/">Porism</a>
                <a href="https://www.local.gov.uk/">LGA</a>
                <a href="https://www.nesta.org.uk/">Nesta</a>
                <span>
                    Copyright © 2018
                </span>
            </div>
        </div>;
    }
};