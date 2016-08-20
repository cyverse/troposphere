import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import Status from 'components/projects/detail/resources/tableData/instance/Status.react';


export default React.createClass({
    displayName: "Status",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        return (
          <ResourceDetail label="Status">
            <div className="resource-status">
              <Status instance={this.props.instance}/>
            </div>
          </ResourceDetail>
        );
    }
});
