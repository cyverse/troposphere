import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import Time from "components/common/Time";

var EndDate = React.createClass({
    displayName: "EndDate",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let endDate = this.props.instance.get("end_date"),
            element = null;

        if (endDate) {
            element = (
                <ResourceDetail label="Deleted">
                    <Time date={endDate} />
                </ResourceDetail>
            );
        }

        return element;
    }
});

export default EndDate;
