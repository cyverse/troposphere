import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import Id from "./details/Id";
import Status from "./details/Status";
import Size from "./details/Size";
import Identity from "./details/Identity";

import { copyElement } from "utilities/clipboardFunctions";


export default React.createClass({
    displayName: "VolumeDetailsSection",

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onClick(e) {
        e.preventDefault();
        copyElement(e.target, { acknowledge: true });
    },

    render() {
        let volume = this.props.volume;

        return (
        <div className="resource-details-section section">
            <h4 className="t-title">Volume Details</h4>
            <ul>
                <Status volume={volume} />
                <Size volume={volume} />
                <Identity volume={volume} />
                <Id volume={volume} />
                <ResourceDetail label="Identifier" onClick={this.onClick}>
                    {volume.get("uuid")}
                </ResourceDetail>
            </ul>
        </div>
        );
    }

});
