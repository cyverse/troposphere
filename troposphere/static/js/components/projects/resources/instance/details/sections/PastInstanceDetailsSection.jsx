import React from "react";
import Backbone from "backbone";
import Status from "./details/Status";
import Id from "./details/Id";
import Alias from "./details/Alias";
import Size from "./details/Size";
import LaunchDate from "./details/LaunchDate";
import EndDate from "./details/EndDate";
import CreatedFrom from "./details/CreatedFrom";
import Identity from "./details/Identity";

var PastInstanceDetailsSection = React.createClass({
    displayName: "PastInstanceDetailsSection",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var instance = this.props.instance;

        return (
        <div className="resource-details-section section">
            <h4 className="t-title">Instance Details</h4>
            <ul>
                <Status instance={instance} />
                <Size instance={instance} />
                <LaunchDate instance={instance} />
                <EndDate instance={instance} />
                <CreatedFrom instance={instance} />
                <Identity instance={instance} />
                <Id instance={instance} />
                <Alias instance={instance} />
            </ul>
        </div>
        );
    }

});

export default PastInstanceDetailsSection;
