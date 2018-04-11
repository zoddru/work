import React from 'react';
import axios from 'axios';
import Error from './Error';
import common from '../common';
const Fragment = React.Fragment;

const dropdownInDelay = 200;
const dropdownOutDelay = 200;
const links = {
    subscriptionLink: 'http://about.esd.org.uk/subscription-benefits',
    changePasswordLink: 'https://signin.esd.org.uk/change.html?app=esd',
    myProfileLink: 'https://signin.esd.org.uk/profile.html?app=esd'
};

const HelpLink = () => <a href="http://gethelp.esd.org.uk/?category=datamaturity">Help</a>;

const ItemLink = ({ item }) => <a href={item.url} className={item.cssClass}>{item.title}</a>;

const ItemParent = ({ item }) => {
    if (!item.children || !item.children.length)
        return <ItemLink item={item} />;
    return <Fragment>
        <ItemLink item={item} />
        <div class="children">
            <MenuItems children={item.children} />
        </div>
    </Fragment>;
};

const MenuItems = ({ children }) => {
    return children.map((item, i) => <ItemParent key={i} item={item} />);
};

const getCurrentUrl = () => (typeof window === 'undefined' || !window.location) ? '' : window.location.href.split("#")[0];

class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.timeoutId = null;
        this.state = { isOpen: false, inDom: false };

        this.windowClick = () => this.close();
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

    toggle() {
        if (this.state.isOpen)
            this.close();
        else
            this.open();
    }

    mouseEnter() {
        this.open();
    }

    mouseLeave() {
        this.close();
    }

    mouseClick(e) {
        e.preventDefault();
        this.toggle();
        return false;
    }
    
    componentDidMount() {
        document.addEventListener('mousedown', this.windowClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.windowClick);
    }

    render() {
        const { label, href, children } = this.props;
        const { isOpen, inDom } = this.state;

        return <div className={`dropdown ${isOpen ? 'open' : ''}`} onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}>
            <a href={href || null}>{label}<span className="toggle" onClick={this.mouseClick.bind(this)}></span></a>
            {inDom && <div className="content">
                {children}
            </div>}
        </div>;
    }
}

const WhenSignedIn = ({ status }) => {
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
};

const WhenSignedOut = ({ status }) => {
    const encodedUrl = encodeURIComponent(getCurrentUrl());

    return <div className="credentials">
        <HelpLink />
        <a href={"/signin?returnUrl=" + encodedUrl}>Sign in</a>
        <a href="https://signin.esd.org.uk/register.html?app=esd">Register</a>
    </div>;
};

const SignInStatus = ({ status }) => {
    return status.isSignedIn
        ? <WhenSignedIn status={status} />
        : <WhenSignedOut status={status} />;
};

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = { menu: [] };
    }

    componentDidMount() {
        axios.get('/resources/menu.json')
            .then(res => {
                this.setState(prevState => ({ menu: res.data }));
            })
            .catch(error => console.log({ success: false, message: 'could not load menu', error }))
    }

    render() {
        const { menu } = this.state;

        const items = menu.map((item, i) => {
            if (!item.children || !item.children.length)
                return <ItemLink key={i} item={item} />;
            return <Dropdown key={i} label={item.title} href={item.url}>
                <MenuItems children={item.children} />
            </Dropdown>;
        });

        return <Fragment>
            {items}
            <SignInStatus status={this.props.status} />
        </Fragment>;
    }
}