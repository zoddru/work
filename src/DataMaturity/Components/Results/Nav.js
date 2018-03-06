import React from 'react';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expandedCategory: null };
    }

    render() {
        const { score } = this.props;
        const { categoryScores } = score;

        const nodes = categoryScores.map(cs => <div className={`node`} key={cs.key}>
            <a href={`#${cs.key}`} className="number">{cs.category.identifier}</a>
        </div>);

        return <nav className="progress">
            <div className={`node`}>
                <a href="#" className="text">Score</a>
            </div>
            {nodes}
        </nav>
    }
}