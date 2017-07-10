import React from "react";


export default React.createClass({
    displayName: "IdentityListHeader",

    propTypes: {
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.element
    },

    render: function() {
        return (
            <div className="container">
                <div style={{ paddingTop: "50px" }} className="identity-name clearfix">
                    <div className="pull-left">
                        <h1 className="t-display-1" >{this.props.title}</h1>
                    </div>
                    <div className="pull-right">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
