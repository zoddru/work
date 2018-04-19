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
            return <ScoreChart key="loading" title="---" color="white" />;
        return selectedFilters.slice(0, this.max).map(f => <ScoreChart key={f.key.toString()} title="---" />);
    }

    get max() {
        return 4;
    }

    renderChildren() {
        const category = this.props.category;
        const aggregatedScores = this.aggregatedScores;
        const scores = getScoresForCategory(aggregatedScores, category);
        const colors = Colors.getColorMap(scores);

        return scores.slice(0, this.max).map(s => {
            const color = colors.get(s);
            console.log(s.key);
            return <ScoreChart key={s.key.toString()} title={s.key.label} score={s} color={color} type={s.key.type} />;
        });
    }
}

const getScoresForCategory = (aggregatedScores, category) => {
    if (!category)
        return aggregatedScores; // the overall scores
    
    const categoryIdentifier = category.identifier;

    return aggregatedScores.map(s => {
        if (!s.categoryScores || !s.categoryScores.length)
            return null;
        return s.categoryScores.find(cs => cs.category && cs.category.identifier === categoryIdentifier);
    });
};