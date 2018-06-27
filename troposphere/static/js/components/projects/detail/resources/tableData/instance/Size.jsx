import React from "react";
import Backbone from "backbone";

export default React.createClass({
    displayName: "Size",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let instance = this.props.instance;
        let size = instance.get("size");

        return <span style={{textTransform: "capitalize"}}>{size.name}</span>;
    }
});
