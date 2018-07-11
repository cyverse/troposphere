import React from "react";
import Backbone from "backbone";
export default React.createClass({
    displayName: "Provider",

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let volume = this.props.volume;
        return <span>{volume.get("provider").name}</span>;
    }
});
