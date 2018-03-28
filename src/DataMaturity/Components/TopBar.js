import React from 'react';
const Fragment = React.Fragment;

const dropdownInDelay = 200;
const dropdownOutDelay = 200;
const links = {
    subscriptionLink: 'http://about.esd.org.uk/subscription-benefits',
    changePasswordLink: 'https://signin.esd.org.uk/change.html?app=esd',
    myProfileLink: 'https://signin.esd.org.uk/profile.html?app=esd'
};

class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.timeoutId = null;
        this.state = { isOpen: false, inDom: false };
    }

    addToDom() {
        this.setState(prevState => ({ inDom: true }));
    }

    removeFromDom() {
        this.setState(prevState => ({ inDom: false }));
    }

    open() {
        this.setState(prevState => ({ isOpen: true }));

        clearTimeout(this.timeoutId);
        if (this.state.inDom)
            return;
        this.timeoutId = setTimeout(this.addToDom.bind(this), dropdownInDelay);
    }

    close() {
        this.setState(prevState => ({ isOpen: false }));

        clearTimeout(this.timeoutId);
        if (!this.state.inDom)
            return;
        this.timeoutId = setTimeout(this.removeFromDom.bind(this), dropdownOutDelay);
    }

    mouseEnter() {
        this.open();
        
    }

    mouseLeave() {
        this.close();
    }

    render() {
        const { label, children } = this.props;
        const { isOpen, inDom } = this.state;

        return <div className={`dropdown ${isOpen ? 'open' : ''}`} onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}>
            <a>{label}</a>
            {inDom && <div className="content">
                {children}
            </div>}
        </div>;
    }
}


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

    const organisationEl = !!organisation && <span className="label subtle">{organisation.label}</span>;
    const subscriptionEl = !!organisation
        ? <a href={links.subscriptionLink}>
            Organisation is {!organisation.isSubscribed ? "NOT" : ""} subscribed to LG Inform Plus
        </a> : null;

    return <div className="credentials">
        <HelpLink />
        <Dropdown label={user.label}>
            <span className="label">
                {user.label}
            </span>
            <span className="label subtle">
                {user.email}
            </span>
            {organisationEl}
            {subscriptionEl}
            <a href={links.changePasswordLink}>Change password</a>
            <a href={links.myProfileLink}>My profile</a>
            <a className="signOut" href={`/signout?returnUrl=${encodedUrl}`}>Sign out</a>
        </Dropdown>
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