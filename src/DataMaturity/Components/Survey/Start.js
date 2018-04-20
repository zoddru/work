import React from 'react';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { survey } = surveyState;

        const first = survey.first;
        const firstKey = !!first ? first.key : 'end';

        return <section className="category start">
            <section className="question">
                <header>
                    <div>
                        <h1>Data Maturity</h1>
                        <p>
                            Rate your organisation's data management skills
                        </p>
                    </div>
                </header>
                <main>
                    <section>
                        <p>
                            This tool is designed to help you make an honest assessment of how advanced your organisation is at dealing with data. You can compare your assessment with others from your own organisation, and from around the country.
                        </p>
                        <p>
                            It is intended to stimulate discussion, give ideas as to how you might improve and provide pointers to case studies and resources that will help. It will not be used to rank people or organisations.
                        </p>
                        <p>
                            The tool was launched in April 2018 as a prototype and your responses, along with general feedback, will be used to improve the tool in future years.
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
                            Your results contribute towards aggregate scores for your role, business function and organisation. Individual results are not shown to other users and results for your organisation are not shown to other organisations, except as part of an aggregate score across a number of organisations. At first when there is a small number of respondents, it might be possible to tie down individual scores.
                        </p>
                        <p>
                            The LGA has access to detailed data which it might use for different aggregations and to offer advice to specific councils. If your organisation ranks highly in one area, the LGA might approach you to ask if you can share your learning with others.
                        </p>
                    </section>
                </main>
                <footer>
                    <div className="navigation">
                        <a href={`#${firstKey}`}
                            className="next button active"
                            onClick={e => this.props.onNext(`${firstKey}`, e)}>Start</a>
                    </div>
                </footer>
            </section>
        </section>;
    }
}