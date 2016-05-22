import React from 'react';

// Renders a nav with several tabs. This nav is created with an onTabClick
// handler, such that, the parent can be notified when a new tab is selected.
// The parent could then render a view when a tab is selected.
export default React.createClass({
    displayName: "TabLinks",

    propTypes: {
        // Index into links that will be shown by default
        defaultLink: React.PropTypes.number.isRequired,
        // List of link names to be rendered
        links: React.PropTypes.array.isRequired,
        onTabClick: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            index: this.props.defaultLink
        }
    },

    onTabClick: function(index) {
        this.props.onTabClick(index);
        this.setState({ index })
    },


    renderLink: function(link, index) {
        let active = "";

        if (index === this.state.index) {
            active = "TabLinks--active";
        }

        let onClick = this.onTabClick.bind(this, index);

        return (
            <li key={index} className="TabLinks-link">
                <a className={active} onClick={onClick}>
                    {link}
                </a>
            </li>
        );
    },

    render: function() {
        return (
            <ul className="TabLinks clearFix">
                {this.props.links.map(this.renderLink)}
            </ul>
        );
    }
});
