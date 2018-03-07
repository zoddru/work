import React from 'react';

export default class GenericSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, heading, content } = this.props;

        if (!content)
            return null;

        return <section className={`sub-section ${className}`}>         
            
            {!!heading && <header>
                <h3>{heading}</h3>
            </header>}

            {content}

        </section>;
    }
}