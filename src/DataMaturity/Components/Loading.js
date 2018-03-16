import React from 'react';

export default class Loading extends React.Component {
    render() {
        const message = this.props.message || 'loading data. just a moment...';

        return <section className="main-content">
            <article>
                <header>
                    <p>
                        {message}
                    </p>
                </header>
                <main className="loader">
                </main>
            </article>
        </section>;
    }
};