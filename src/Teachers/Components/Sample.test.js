import test from 'ava';
import jsdom from 'jsdom';
import React from 'react';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PayModelStore from '../PayModelStore';
import PayModelComponent from './PayModelComponent';
const { JSDOM } = jsdom;

configure({ adapter: new Adapter() });

class Foo extends React.Component {
    constructor(props) {
      super(props);
      this.state = { counter: { count: 0 } };
    }

    inc() {
      this.setState({ counter: { count: this.state.counter.count + 1 } });
    }

    setCount(e) {
        this.setState({ counter: { count: parseInt(e.target.value) } });
    } 

    render() {
      return (
        <div>
          <div className="clicks">
            {this.state.counter.count}
          </div>
          <a href="url" className="one" onClick={() => { this.setState({ counter: { count: this.state.counter.count + 1 } }); }}>
            Increment
          </a>
          <a href="url" className="two" onClick={this.inc.bind(this)}>
            Increment
          </a>
          <input type="text" value={this.state.counter.count} onChange={this.setCount.bind(this)} />
        </div>
      );
    }
  }

  test('sample', t => {

    const wrapper = mount(<Foo />);

    t.is(wrapper.find('.clicks').text(), '0');
    wrapper.find('a.one').simulate('click');
    t.is(wrapper.find('.clicks').text(), '1');
    wrapper.find('a.two').simulate('click');
    t.is(wrapper.find('.clicks').text(), '2');
    wrapper.find('input').simulate('change', { target: { value: 5 } });
    t.is(wrapper.find('.clicks').text(), '5');
})