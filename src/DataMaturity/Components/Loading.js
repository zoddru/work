import React from 'react';

export default class Loading extends React.Component {
    render() {
        const isSubSection = !!this.props.isSubSection;
        const message = this.props.message || 'loading data. just a moment...';

        if (isSubSection) {
            return <section class="loader-container">                
                <p>
                    {message}
                </p>
                <div className="loader">
                </div>
            </section>;
        }

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