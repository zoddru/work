import React from 'react';
import NavHelper from '../NavHelper';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expandedScore: null };
    }

    handleScroll() {
        if (this.unmounted || !this.props.score.categoryScores)
            return;

        const expandedScore = NavHelper.findTopElement(
            '.category.score',
            this.props.score.categoryScores,
            this.props.score.key,
            (item, key) => (item.category ? item.category.key : item.key) === key
        );

        this.setState({ expandedScore });

        NavHelper.setHash(expandedScore.category || expandedScore);
    }

    render() {
        const { score } = this.props;
        const { categoryScores } = score;
        const { expandedScore } = this.state;

        const nodes = categoryScores.map(cs => {
            const selectedClassName = cs === expandedScore ? 'selected' : '';

            return <div className={`node ${selectedClassName}`} key={cs.category.key}>
                <a href={`#${cs.category.key}`} className="text">{cs.category.identifier}</a>
            </div>;
        });

        const topSelectedClassName = expandedScore && expandedScore.isStart ? 'selected' : '';

        return <nav className="progress">
            <div className={`node ${topSelectedClassName}`}>
                <a href="#" className="text">Overall</a>
            </div>
            {nodes}
        </nav>;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleScroll.bind(this));
        this.handleScroll();
    }

    componentWillUnmount() {
        this.unmounted = true;
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleScroll.bind(this));
    }
}