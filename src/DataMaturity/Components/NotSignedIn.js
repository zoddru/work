import React from 'react';
import SignInDetails from './SignInDetails';

export default class NotSignedIn extends React.Component {
    render() {
        return <section className="main-content">
            <article>
                <header>
                    <h2>Not signed in</h2>
                </header>
                <main>
                    <SignInDetails status={this.props.status} />
                </main>
            </article>
        </section>;
    }
};