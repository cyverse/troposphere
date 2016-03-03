import React from 'react';

export default React.createClass({
    displayName: "TabLinks",

    propTypes: {
        currentView: React.PropTypes.string.isRequired,
        linkList: React.PropTypes.array.isRequired,
        onChangeView: React.PropTypes.func.isRequired
    },

    onChangeView: function(item) {
        this.props.onChangeView(item);
    },

    renderLinks: function(item, i) {
        let active = "";
        if (item === this.props.currentView) {
            active = "TabLinks--active";
        }

        return (
            <li key={i} className="TabLinks-link">
                <a className={active}
                    onClick={this.onChangeView.bind(this, item)}
                >
                    {item}
                </a>
            </li>
        )
    },

    render: function() {
        return (
            <ul className="TabLinks clearFix">
                {this.props.linkList.map(this.renderLinks)}
            </ul>
        )
    }
});
