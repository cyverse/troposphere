import React from 'react/addons';
import Backbone from 'backbone';
import InstanceTable from './InstanceTable.react';
import NoInstanceNotice from './NoInstanceNotice.react';

export default React.createClass({
    displayName: "InstanceList",

    propTypes: {
      instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInstanceContent: function () {
      if (this.props.instances.length > 0) {
        return (
          <InstanceTable
            instances={this.props.instances}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}
            onPreviewResource={this.props.onPreviewResource}
            previewedResource={this.props.previewedResource}
            selectedResources={this.props.selectedResources}
            />
        );
      } else {
        return (
          <NoInstanceNotice/>
        );
      }
    },

    render: function () {
      return (
        <div>
          <div className="header">
            <i className="glyphicon glyphicon-tasks"></i>

            <h3 className="title-3">Instances</h3>
          </div>
          {this.getInstanceContent()}
        </div>
      );
    }
});
