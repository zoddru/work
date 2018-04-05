import React from 'react';

function getCurrentUrl() {
    if (typeof window === 'undefined' || !window.location)
        return '';
    return window.location.href.split("#")[0];;
}

function WhenSignedIn(props) {
    const { status } = props;
    const encodedUrl = encodeURIComponent(getCurrentUrl());
    const user = status.user;
    const organisation = user.organisation;

    return <div className="signInDetails">
        You are signed in as <strong>{user.label}</strong>{!!organisation ? ` from ${organisation.label}` : ''}. <a className="button" href={"/signout?returnUrl=" + encodedUrl}>sign out</a>
    </div>;
}

function WhenSignedOut(props) {
    const { status, message = message || 'You are not signed in.' } = props;
    const encodedUrl = encodeURIComponent(getCurrentUrl());

    return <div className="signInDetails">
        {message} <a className="button" href={"/signin?returnUrl=" + encodedUrl}>sign in</a>
    </div>;
}

function SignInStatus(props) {
    const { status, signedOutMessage } = props;

    return status.isSignedIn
        ? <WhenSignedIn status={status} />
        : <WhenSignedOut status={status} message={signedOutMessage} />;
}

export default class SignInDetails extends React.Component {
    constructor(props) {
        super(props);

        const { status } = props;

        this.state = { status };
    }

    render() {
        const { signedOutMessage } = this.props;
        const { status } = this.state;

        return <SignInStatus status={status} signedOutMessage={signedOutMessage} />;
    }
}