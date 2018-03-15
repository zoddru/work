import React from 'react';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <section className="main-content">
            <article class="essay">
                <header>
                    <h2>Data Maturity</h2>
                </header>
                <section className="introduction">
                    <header>
                        <h3>Introduction</h3>
                    </header>
                    <p>
                        Mike says there is some introductory text, but I cannot find it. I can however, find a disclaimer
                    </p>
                </section>
                <section className="disclaimer">
                    <header>
                        <h3>Disclaimer</h3>
                    </header>
                    <p>
                        This Prototype Data Maturity Model has been prepared by Nesta solely for information purposes, 
                        and is available to a limited number of parties solely to assist the recipient in testing 
                        approaches to assessing data maturity.
                        Nesta reserves the right to amend or replace the prototype at any time.
                        This prototype has not been independently verified and Nesta, its respective directors,
                        employees or affiliates makes any representation or warranty, express or implied,
                        as to the accuracy,
                        completeness or fairness of any information provided in connection with the prototype,
                        and none of such parties shall have any liability for the information contained in,
                        or for any omissions from the prototype.
                    </p>
                    <p>
                        This prototype references work by HESA - for more information visit: 
                        <a href="https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity">https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity</a>
                    </p>
                    <p class="devNote">
                        This text was taken from <a href="https://docs.google.com/spreadsheets/d/1P3zexCA2oP9XuUhWf1knfpWFBAx9oZOt0TF6yhPmYH0/edit#gid=965121555">here</a>.
                    </p>
                </section>
            </article>
        </section>;
    }
}