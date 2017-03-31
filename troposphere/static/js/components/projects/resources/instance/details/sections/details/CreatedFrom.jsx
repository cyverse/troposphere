import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

import stores from "stores";

import ResourceDetail from "components/projects/common/ResourceDetail";


export default React.createClass({
    displayName: "CreatedFrom",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var instance = this.props.instance,
            image = stores.ImageStore.get(instance.get("image").id);

        if (!image) {
            return (
            <div className="loading-tiny-inline"></div>
            );
        }

        return (
        <ResourceDetail label="Based on">
            <Link to={`images/${image.id}`}>
                {image.get("name")}
            </Link>
        </ResourceDetail>
        );
    }
});
