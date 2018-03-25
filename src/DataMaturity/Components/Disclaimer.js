import React from 'react';
import SignInDetails from './SignInDetails';

export default class NotSignedIn extends React.Component {
    render() {
        return <section className="main-content">
            <article>
                <header>
                    <h2>Disclaimer</h2>
                </header>
                <main>
                    <p>
                        This Prototype Data Maturity Model has been prepared by Nesta solely for information purposes,
                        and is available to a limited number of parties solely to assist the recipient in testing
                        approaches to assessing data maturity.
                    </p>
                    <p>
                        Nesta reserves the right to amend or replace the prototype at any time.
                    </p>
                    <p>
                        This prototype has not been independently verified and Nesta, its respective directors,
                        employees or affiliates makes any representation or warranty, express or implied,
                        as to the accuracy,
                        completeness or fairness of any information provided in connection with the prototype,
                        and none of such parties shall have any liability for the information contained in,
                        or for any omissions from the prototype.
                        </p>
                    <p>
                        This prototype references work by HESA - for more information visit:&nbsp;
                        <a href="https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity">https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity</a>
                    </p>
                </main>
            </article>
        </section>;
    }
};