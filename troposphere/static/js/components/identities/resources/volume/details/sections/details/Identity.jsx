import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";

export default React.createClass({
    displayName: "Identity",

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let volume = this.props.volume;

        return (
        <ResourceDetail label="Provider">
            {volume.get("provider").name}
        </ResourceDetail>
        );
    }

});
