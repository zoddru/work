import React from 'react';

export default class Result extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { score } = this.props;

        const scores = score.categoryScores;

        const categoryEls = [];
        const meanEls = [];
        const statusEls = [];
        const ranksEls = [];

        scores.forEach(s => {
            categoryEls.push(<th key={s.category.key}>{s.category.label}</th>);
            meanEls.push(<td key={s.key} className={typeof (s.mean) === 'number' ? 'number' : ''}>{s.meanDisplayName}</td>);
            statusEls.push(<td key={s.key}>{s.isValid ? 'valid' : 'invalid'}</td>);
            ranksEls.push(<td key={s.key}>{s.rankLabel}</td>);
        });

        return <table class="summary">
            <thead>
                <tr>
                    {categoryEls}
                    <th>Overall</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {meanEls}
                    <th className={typeof (score.mean) === 'number' ? 'number' : ''}>{score.meanDisplayName}</th>
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