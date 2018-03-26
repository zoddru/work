import React from 'react';

export default class Disclaimer extends React.Component {
    render() {
        return <section className="main-content">
            <article>
                <header>
                    <h2>Disclaimer</h2>
                </header>
                <main>
                    <p>
                        This Prototype Data Maturity Model has been prepared by the LGA and Nesta solely for information purposes.
                    </p>
                    <p>
                        The LGA and Nesta reserve the right to amend or replace the prototype at any time.
                    </p>
                    <p>
                        This prototype has not been independently verified. The LGA and Nesta, their respective directors, employees or affiliates do not make any representation or warranty, express or implied, as to the accuracy, completeness or fairness of any information provided in connection with the prototype, and none of such parties shall have any liability for the information contained in, or for any omissions from the prototype.
                    </p>
                    <p>
                        This prototype references work by HESA - for more information visit:
                        <a className="link" href="https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity">
                            https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity</a>
                    </p>
                </main>
            </article>
        </section>;
    }
};