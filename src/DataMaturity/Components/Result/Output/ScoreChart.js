import React from 'react';

const gray = "rgb(70, 75, 81)";

export default class ScoreChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { title, score } = this.props;
        const { percentage, rankLabel, meanDisplayName } = score;
        const y = Math.floor(100 - percentage);
        const height = Math.ceil(percentage);

        const clipPathId = `${score.key}-cut-off`;

        return <figure className="score-dial">
            <svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <defs>
                    <clipPath id={clipPathId}>
                        <rect x="0" y={y} width="100" height={height} />
                    </clipPath>
                </defs>

                <circle cx="50" cy="50" r="48" fill="red" clipPath={`url(#${clipPathId})`} />
                <circle cx="50" cy="50" r="46" stroke={gray} strokeWidth="4" fill="transparent" />

                <text x="50" y="50" fontFamily="Roboto,Arial,Verdana,sans-serif" fill={gray} fontWeight="bold" fontSize="14" textAnchor="middle" alignmentBaseline="central">
                    {rankLabel}
                </text>
                <text x="50" y="66" fontFamily="Roboto,Arial,Verdana,sans-serif" fill={gray} fontSize="10" textAnchor="middle" alignmentBaseline="central">
                    {meanDisplayName}
                </text>
            </svg>
            <figcaption>{title}</figcaption>
        </figure>;
    }
}