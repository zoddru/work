import React from 'react';

export default class Loading extends React.Component {
    render() {
        const isSubSection = !!this.props.isSubSection;
        const message = this.props.message || 'Something is not right';

        const content = <section class="error">
            <header>
                <h2>Something is wrong</h2>
            </header>
            <p>
                {message}
            </p>
        </section>;

        if (isSubSection)
            return content;

        return <section className="main-content">
            <article>
                {content}
            </article>
        </section>;
    }
};