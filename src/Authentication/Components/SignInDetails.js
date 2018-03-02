import React from 'react';

function getCurrentUrl() {
    if (typeof window === 'undefined' || !window.location)
        return '';
    return window.location.href;
}

function WhenSignedIn(props) {
    const { status } = props;
    const encodedUrl = encodeURIComponent(getCurrentUrl());
    const user = status.user;
    const organisation = user.organisation;

    return <div>
        You are signed in as <strong>{user.label}</strong>. <a className="button" href={`/signout?returnUrl=${encodedUrl}`}>sign out</a>
        <table className="normal">
            <tbody>
                <tr>
                    <th>identifier</th><td>{user.identifier}</td>
                </tr>
                <tr>
                    <th>email</th><td>{user.email}</td>
                </tr>
                <tr>
                    <th>organisation</th><td>{!!organisation ? organisation.label : 'none'}</td>
                </tr>
            </tbody>        
        </table>
    </div>;
}

function WhenSignedOut(props) {
    const { status } = props;
    const encodedUrl = encodeURIComponent(getCurrentUrl());

    return <div>You are not signed in. <a className="button" href={`/signin?returnUrl=${encodedUrl}`}>sign in</a></div>;
}

function SignInStatus(props) {
    const { status } = props;

    return status.isSignedIn
        ? <WhenSignedIn status={status} />
        : <WhenSignedOut status={status} />;
}

export default class SignInDetails extends React.Component {
    constructor(props) {
        super(props);

        const { status } = props;

        this.state = { status };
    }

    render() {
        const { status } = this.state;

        return <div>
            <SignInStatus status={status} />
        </div>;
    }
}