import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import CopyButton from "components/common/ui/CopyButton";
import Id from "./details/Id";
import Status from "./details/Status";
import Size from "./details/Size";
import Identity from "./details/Identity";

export default React.createClass({
    displayName: "VolumeDetailsSection",

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render() {
        const volume = this.props.volume;
        const uuid = volume.get("uuid");
        return (
        <div className="resource-details-section section">
            <h4 className="t-title">Volume Details</h4>
            <ul>
                <Status volume={volume} />
                <Size volume={volume} />
                <Identity volume={volume} />
                <Id volume={volume} />
                <ResourceDetail label="Identifier">
                    { uuid }
                    <CopyButton text={ uuid } />
                </ResourceDetail>
            </ul>
        </div>
        );
    }

});
