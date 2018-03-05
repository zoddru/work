import React from 'react';

export default class SurveyResults extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score } = this.props;

        const scores = score.categoryScores;
        const categoryThEls = scores.map(s => <th key={s.category.key}>{s.category.label}</th>);
        const meanEls = scores.map(s => <td key={s.key} className={typeof (s.mean) === 'number' ? 'number' : ''}>{s.displayMean}</td>);
        const statusEls = scores.map(s => <td key={s.key}>{s.isValid ? 'valid' : 'invalid'}</td>);
        const ranksEls = scores.map(s => <td key={s.key}>{s.rankLabel}</td>);

        return <table class="summary">
            <thead>
                <tr>
                    {categoryThEls}
                    <th>Overall</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {meanEls}
                    <th className={typeof (score.mean) === 'number' ? 'number' : ''}>{score.displayMean}</th>
                </tr>
                <tr>
                    {statusEls}
                    <th>{score.isValid ? 'valid' : 'invalid'}</th>
                </tr>
                <tr>
                    {ranksEls}
                    <th>{score.rankLabel}</th>
                </tr>
            </tbody>
        </table>;
    }
}