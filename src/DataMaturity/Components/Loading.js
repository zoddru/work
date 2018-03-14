import React from 'react';

export default class Loading extends React.Component {
    render() {
        return <section className="main-content">
            <article>
                <section className="loading">
                    <p>
                        fetching data. please hold...
                    </p>
                </section>
                <div className="loader">
                </div>
            </article>
        </section>;
    }
};