import React from "react";
import { Link } from "react-router";


export default React.createClass({
    displayName: "CallToAction",

    propTypes: {
        title: React.PropTypes.string.isRequired,
        image: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        linksTo: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
        <Link to={this.props.linksTo} className="option">
            <img src={this.props.image} />
            <br/>
            <h2 className="t-title option__title">{this.props.title}</h2>
            <hr/>
            <p className="option__description">
                {this.props.description}
            </p>
        </Link>
        );
    }
});
