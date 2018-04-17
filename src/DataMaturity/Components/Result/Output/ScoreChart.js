import React from 'react';

const darkGray = "rgb(70, 75, 81)";
const lightGray = "rgb(180, 180, 180)";

const defaultScore = Object.freeze({
    key: 'loading',
    percentage: 0,
    rankLabel: 'loading...',
    meanDisplayName: '---'
});

export default class ScoreChart extends React.Component {
    constructor(props) {
        super(props);
    }

    get clipPathId() {
        const { score, type } = this.props;
        
        const key = score && score.key && score.key.toString() || 'unknown';

        return `${key}-score-chart-${type}-clip`;
    }

    render() {
        const { title, score = score || defaultScore, color = color || '#00ff00' } = this.props;
        const { percentage, rankLabel, meanDisplayName } = score;
        const height = Math.ceil(90 * percentage / 100);
        const y = Math.floor(95 - height);

        const clipPathId = this.clipPathId;

        return <figure className="score-dial">
            <svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <defs>
                    <clipPath id={clipPathId}>
                        <rect x="0" y={y} width="100" height={height} />
                    </clipPath>
                </defs>

                <circle cx="50" cy="50" r="45" fill={color} clipPath={`url(#${clipPathId})`} />
                <circle cx="50" cy="50" r="46" stroke={darkGray} strokeWidth="2" fill="transparent" />

                <text x="50" y="50" fontFamily="Roboto,Arial,Verdana,sans-serif" fill={darkGray} fontWeight="bold" fontSize="14" textAnchor="middle" alignmentBaseline="central">
                    {rankLabel}
                </text>
                <text x="50" y="66" fontFamily="Roboto,Arial,Verdana,sans-serif" fill={darkGray} fontWeight="bold" fontSize="12" textAnchor="middle" alignmentBaseline="central">
                    {meanDisplayName}
                </text>
            </svg>
            <figcaption>{title}</figcaption>
        </figure>;
    }
}