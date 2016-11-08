import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import ActivitySection from "components/projects/detail/resources/tableData/instance/Activity";

var Activity = React.createClass({
    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {

        return (
        <ResourceDetail label="Activity">
            <div className="resource-status">
                <ActivitySection instance={this.props.instance} />
            </div>
        </ResourceDetail>
        );
    }

});

export default Activity;
