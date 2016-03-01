import React from 'react';

export default React.createClass({
    renderLinks: function(item) {
        return (
            <li className="TabLinks-link">
                <a className="TabLinks--active">{item}</a>
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
