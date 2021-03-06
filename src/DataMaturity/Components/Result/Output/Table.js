import React from 'react';
import Base from './Base';
import SimpleTable from './SimpleTable';
import Loading from '../../Loading';

export default class Table extends Base {
    constructor(props) {
        super(props);
    }

    renderChildren() {
        const table = this.aggregatedTable;

        return <SimpleTable className="summary" table={table} />;
    }

    get aggregatedTable() {
        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
            return null;

        const scores = this.aggregatedScores;
        const { survey, options } = surveyState;
        const categories = survey.categories;

        const headings = ['Data'].concat(categories.map(c => c.identifier)).concat(['Overall']);
        const rows = [];

        scores.forEach(s => {
            const row = [s.key];
            rows.push(row);

            categories.forEach(c => {
                const cs = s.categoryScores.find(cs => cs.category.identifier === c.identifier);
                row.push(!!cs ? cs.fullLabel : '---');
            });

            row.push(s.fullLabel);
        });

        return { headings, rows };
    }
}