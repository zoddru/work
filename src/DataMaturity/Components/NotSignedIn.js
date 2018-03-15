import React from 'react';
import SignInDetails from './SignInDetails';

export default class NotSignedIn extends React.Component {
    render() {
        return <section className="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>Not signed in</h2>
                    </header>
                    <SignInDetails status={this.props.status} />
                </section>
            </article>
        </section>;
    }
};