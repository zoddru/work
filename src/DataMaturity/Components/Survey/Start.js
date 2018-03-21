import React from 'react';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { survey } = surveyState;

        const firstQuestion = survey.firstQuestion;
        const firstQuestionKey = !!firstQuestion ? firstQuestion.key : 'end';

        return <section className="category start">
            <section className="question">
                <header>
                    <h1>Data Maturity</h1>
                </header>
                <main>
                    <section>
                        <p>
                            This tool is designed to let you make an honest assessment of how mature your organisation is at dealing with data. You can compare your assessment with averages for different types of people in the organisation and averages for other organisations.
                        </p>
                        <p>
                            It is intended to stimulate discussion, give ideas as to how you might improve and provide pointers to case studies and resources that will help. It will not be used to rank people or organisations.
                        </p>
                        <p>
                            The tool was launched in April 2018 as a prototype.  We offer the opportunity to say if you don’t know the answer to any question or if you don’t understand a question.  Such responses, along with general feedback will be used to improve the tool in future years.
                        </p>
                    </section>

                    <section>
                        <header>
                            <h2>How your data will be used</h2>
                        </header>
                        <p>
                            You need to register and sign in to agree to the data usage policy, to save your responses and to see resultant improvement advice.
                        </p>
                        <p>
                            Your results contribute towards aggregate scores for your role, business function and organisation. Individual results are not shown to other users and results for your organisation are not shown to other organisations, except as part of an aggregate score across a number of organisations. At first when there is a small number of respondents, it might be possible to tie down individual scores by cross-tabulation.
                        </p>
                        <p>
                            The LGA has access to detailed data which it might use for different aggregations and to offer advice to specific councils. If your organisation ranks highly in one area, the LGA might approach you to ask if you can share your learning with others.
                        </p>
                    </section>

                    <section>
                        <header>
                            <h2>Disclaimer</h2>
                        </header>
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
                            This prototype references work by HESA - for more information visit:
                            <a href="https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity">https://www.hesa.ac.uk/support/tools/data-capability/full/assess-maturity</a>
                        </p>
                    </section>
                </main>
                <footer>
                    <div className="navigation">
                        <a href={`#${firstQuestionKey}`}
                            className="next button"
                            onClick={e => this.props.onNext(`${firstQuestionKey}`, e)}>Start</a>
                    </div>
                </footer>
            </section>
        </section>;
    }
}