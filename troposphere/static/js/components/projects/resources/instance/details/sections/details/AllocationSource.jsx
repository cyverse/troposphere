import React from "react";
import Backbone from "backbone";
import stores from "stores";

import ResourceDetail from "components/projects/common/ResourceDetail";

export default React.createClass({
    displayName: "Id",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let sourceList = stores.AllocationSourceStore.getAll();
        let sourceName;
        // We will be using instance to querry for the current Allocation Source
        if (this.props.instance && sourceList) {
            sourceName = sourceList.at(1).get("name");
        }

        return (
        <ResourceDetail label="Allocation Source">
            {sourceName}
        </ResourceDetail>
        );
    }
});
