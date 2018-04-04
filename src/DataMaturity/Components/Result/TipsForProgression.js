import React from 'react';
const Fragment = React.Fragment;

const ranks = [
    { identifier: 'Nascent', label: 'Nascent → Basic' },
    { identifier: 'Basic', label: 'Basic → Intermediate' },
    { identifier: 'Intermediate', label: 'Intermediate → Advanced' },
    { identifier: 'Advanced', label: 'Advanced → Expert' },
    { identifier: 'Expert', label: 'Maintaining expertise ' }
];

const renderSection = (rank, content, currentRank) => {
    const identifier = rank.identifier;

    if (!content[identifier] || !content[identifier].tips)
        return null;

    const tips = content[identifier].tips

    return <section key={identifier} className={`sub-section tips ${rank.identifier === currentRank && ' current'}`}>

        <header>
            <h3>Tips for progression</h3>
            <h4>{rank.label}</h4>
        </header>

        {tips}

    </section>;
};

export default class TipsForProgression extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { content, currentRank } = this.props;

        const sections = ranks.map(l => renderSection(l, content, currentRank)).filter(s => !!s);

        return sections;
    }
}