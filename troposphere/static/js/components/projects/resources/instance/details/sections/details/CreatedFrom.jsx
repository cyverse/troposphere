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
        //Future-FIXME: Include bootable volume support && link.
        var instance = this.props.instance,
            instance_image = instance.get("image"),
            version = instance.get('version'),
            version_separator = "v",  // Future-FIXME: This is a configurable in atmosphere that could be passed through clank and used..
            image_name = "",
            version_name = "",
            label = "",
            image = (instance_image) ? stores.ImageStore.get(instance_image.id) : null; //Bootable volumes have no image ID..

        if(!instance_image || !image) {
            return (
            <div className="loading-tiny-inline"></div>
            );
        }
        image_name = image.get('name');
        version_name = (version && version.name) ? version.name : "";
        label = (version_name) ? image_name+" "+version_separator+version_name : image_name;

        return (
        <ResourceDetail label="Based on">
            <Link to={`images/${image.id}`}>
                {label}
            </Link>
        </ResourceDetail>
        );
    }
});
