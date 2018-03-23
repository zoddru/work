import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
const Component = React.Component;
const Fragment = React.Fragment;



export default class AppRoot extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Router>
            <Fragment>
                <nav>
                    <NavLink exact className="button" activeClassName="active" to="/">Hello</NavLink>
                    <NavLink exact className="button" activeClassName="active" to="/how">How</NavLink>
                    <NavLink exact className="button" activeClassName="active" to="/bye">Bye</NavLink>
                </nav>
                <Route render={({ location }) => (
                    <TransitionGroup>
                        <CSSTransition key={location.key} classNames="fade" timeout={1000}>
                            <Switch location={location}>
                                <Route exact path="/" component={Hello} />
                                <Route exact path="/how" component={How} />
                                <Route exact path="/bye" component={Bye} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                )}
                />
            </Fragment>
        </Router>;
    }
}

class Hello extends Component {
    render() {
        return <section class="main-content">
            <article>
                <header>
                    <h2>HELLO WORLD</h2>
                    hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />
                    hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />
                    hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />
                    hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />
                    hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />hello<br />
                </header>
            </article>
        </section>;
    }
}

class How extends Component {
    render() {
        return <section class="main-content">
            <article>
                <header>
                    <h2>HOW ARE YOU</h2>
                </header>
            </article>
        </section>;
    }
}

class Bye extends Component {
    render() {
        return <section class="main-content">
            <article>
                <header>
                    <h2>BYE BYE</h2>
                    bye<br />bye<br />bye<br />bye<br />bye<br />bye<br />bye<br />
                    bye<br />bye<br />bye<br />bye<br />bye<br />bye<br />bye<br />
                    bye<br />bye<br />bye<br />bye<br />bye<br />bye<br />bye<br />
                </header>
            </article>
        </section>;
    }
}