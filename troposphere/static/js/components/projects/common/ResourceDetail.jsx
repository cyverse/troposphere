import React from "react";

export default React.createClass({
    displayName: "ResourceDetail",

    propTypes: {
        label: React.PropTypes.string.isRequired,
        children: React.PropTypes.node.isRequired,
        onClick: React.PropTypes.func
    },

    render: function() {
        let detailValue,
            { children, label, onClick } = this.props;

        if (onClick) {
            detailValue = (
            <div className="detail-value" onClick={onClick}>
                {children}
            </div>
            );
        } else {
            detailValue = (
            <div className="detail-value">
                {children}
            </div>
            );
        }

        return (
        <li className="clearfix">
            <div className="t-body-2 detail-label">
                {label + " "}
            </div>
            {detailValue}
        </li>
        );
    }
});
