import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";

import { copyElement } from "utilities/clipboardFunctions";


export default React.createClass({
    displayName: "Alias",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onClick(e) {
        e.preventDefault();
        copyElement(e.target, { acknowledge: true });
    },

    render() {
        return (
        <ResourceDetail label="Alias" onClick={this.onClick}>
            {this.props.instance.get("uuid")}
        </ResourceDetail>
        );
    }
});
