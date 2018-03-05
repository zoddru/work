import React from 'react';

export default class SurveyEnd extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { surveyState } = this.props;
        const { survey, answers } = surveyState;

        const lastQuestion = survey.lastQuestion;

        const categoryThEls = survey.categories.map(c => <th key={c.key}>{c.label}</th>);
        const score = survey.score(answers);
        const scores = score.categoryScores;
        const meanEls = scores.map(s => <td key={s.key} className={ typeof(s.mean) === 'number' ? 'number' : '' }>{s.displayMean}</td>);
        const statusEls = scores.map(s => <td key={s.key}>{s.isValid ? 'valid' : 'invalid'}</td>);

        return <section className="category end" id="end">
            <header>
                <h2>Finished</h2>
            </header>
            <main>
                <table class="summary">
                    <thead>
                        <tr>
                            {categoryThEls}
                            <th>Overall</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {meanEls}
                            <th className={ typeof(score.mean) === 'number' ? 'number' : '' }>{score.displayMean}</th>
                        </tr>
                        <tr>
                            {statusEls}
                            <th>{score.isValid ? 'valid' : 'invalid'}</th>
                        </tr>
                    </tbody>
                </table>
                <div className="feedback">
                    <label for={`feedback`}>Feedback</label>
                    <textarea id={`.feedback`} placeholder="tell us any thoughts on this survey?" />
                </div>
            </main>
            <footer>
                <div className="navigation">
                    {lastQuestion && <a href={`#${lastQuestion.key}`} className="prev button">Previous</a>}
                </div>
            </footer>
        </section>;
    }
}