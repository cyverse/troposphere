import React from "react";
import Backbone from "backbone";

export default React.createClass({
    displayName: "Provider",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let instance = this.props.instance;

        return (
        <span>{instance.get('provider').name}</span>
        );
    }
});
