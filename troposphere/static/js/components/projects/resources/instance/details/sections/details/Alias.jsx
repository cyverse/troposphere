import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import CopyButton from "components/common/ui/CopyButton";

export default React.createClass({
    displayName: "Alias",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render() {
        const uuid = this.props.instance.get("uuid");
        return (
            <ResourceDetail label="Alias">
                {uuid}
                <CopyButton text={uuid} />
            </ResourceDetail>
        );
    }
});
