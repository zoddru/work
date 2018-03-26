import React from 'react';

function getCurrentUrl() {
    if (typeof window === 'undefined' || !window.location)
        return '';
    return window.location.href.split("#")[0];;
}

function HelpLink() {
    return <a href="http://gethelp.esd.org.uk/?category=datamaturity">Help</a>;
}

function WhenSignedIn(props) {
    const { status } = props;
    const encodedUrl = encodeURIComponent(getCurrentUrl());
    const user = status.user;
    const organisation = user.organisation;

    return <div className="credentials">
        <HelpLink />
        <div className="dropdown">
            <a>{user.label}</a>
            {/* <div className="content">
                <p>
                    {user.label}
                </p>
            </div> */}
        </div>
    </div>;

    return <div className="signInDetails">
        You are signed in as <strong>{user.label}</strong>{!!organisation ? ` from ${organisation.label}` : ''}. <a className="button" href={"/signout?returnUrl=" + encodedUrl}>sign out</a>
    </div>;
}

function WhenSignedOut(props) {
    const { status } = props;
    const encodedUrl = encodeURIComponent(getCurrentUrl());

    return <div className="credentials">
        <HelpLink />
        <a href={"/signin?returnUrl=" + encodedUrl}>Sign in</a>
        <a href="https://signin.esd.org.uk/register.html?app=esd">Register</a>
    </div>;
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

        return <SignInStatus status={status} />;
    }
}