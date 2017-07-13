import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import Size from "models/Size"


export default React.createClass({
    displayName: "Size",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let instance = this.props.instance;
        let size = instance.get('size');

        if (!(size instanceof Size)) {
            size = new Size(size, {parse: true});
        }

        return (
        <ResourceDetail label="Size">
            {size.formattedDetails()}
        </ResourceDetail>
        );
    }
});
