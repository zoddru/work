import React from 'react';
import Base from './Base';
import ScoreChart from './ScoreChart';
import Colors from './Colors';
import Loading from '../../Loading';
const Fragment = React.Fragment;

export default class Dials extends Base {
    constructor(props) {
        super(props);
    }

    renderLoading(message) {
        const { loadingFilters, selectedFilters } = this.state;
        if (loadingFilters)
            return <ScoreChart key="loading" title="---" />;
        return selectedFilters.slice(0, this.max).map(f => <ScoreChart key={f.key.toString()} title="---" />);
    }

    get max() {
        return 4;
    }

    renderChildren() {
        const scores = this.aggregatedScores;
        const colors = Colors.getColorMap(scores);

        return scores.slice(0, this.max).map(s => {
            const color = colors.get(s);
            return <ScoreChart key={s.key.toString()} title={s.key.label} score={s} color={color} type={s.key.type} />;
        });
    }
}