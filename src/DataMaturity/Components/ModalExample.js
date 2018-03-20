import React from 'react';
import Modal from 'react-responsive-modal';

export default class ModalExample extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        };
    }

    onOpenModal() {
        this.setState({ open: true });
    };

    onCloseModal() {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        return <section className="main-content">
            <article>
                <header>
                    <p>
                        HELLO FROM MODAL
                    </p>
                </header>
                <main>
                    <br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX
                    <br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX
                    <button class="button" onClick={this.onOpenModal.bind(this)}>Open modal</button>
                    <br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX
                    <br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX
                    <br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX
                    <br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX
                    <br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX<br /><br /><br /><br />XXX
                </main>
            </article>
            <Modal open={open} onClose={this.onCloseModal.bind(this)} little>
                <h2>Simple centered modal</h2>
            </Modal>
        </section>;
    }
};