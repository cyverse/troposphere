import React from "react";

export default React.createClass({
    displayName: "ResourceDetail",

    propTypes: {
        label: React.PropTypes.string.isRequired,
        children: React.PropTypes.node.isRequired,
        onClick: React.PropTypes.func
    },

    render: function() {
        let detailValue;

        if (this.props.onClick) {
            detailValue = (
            <div className="detail-value" onClick={this.props.onClick}>
                {this.props.children}
            </div>
            );
        } else {
            detailValue = (
            <div className="detail-value">
                {this.props.children}
            </div>
            );
        }

        return (
        <li className="clearfix">
            <div className="t-body-2 detail-label">
                {this.props.label + " "}
            </div>
            {detailValue}
        </li>
        );
    }
});
