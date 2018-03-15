import React from 'react';

export default class Loading extends React.Component {
    render() {
        const message = this.props.message || 'loading data. just a moment...';

        return <section className="main-content">
            <article>
                <section className="loading">
                    <p>
                        {message}
                    </p>
                </section>
                <div className="loader">
                </div>
            </article>
        </section>;
    }
};