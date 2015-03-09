define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      InstanceRow = require('./InstanceRow.react'),
      InstanceNotRealRow = require('./InstanceNotRealRow.react'),
      SelectableTable = require('../SelectableTable.react');

  return React.createClass({
    displayName: "InstanceTable",

    propTypes: {
      instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInstanceRows: function(instances){
      var previewedResource = this.props.previewedResource,
          selectedResources = this.props.selectedResources;

      return instances.map(function(instance){
        var isPreviewed = (previewedResource === instance);
        var isChecked = selectedResources.get(instance) ? true : false;

        return (
          <InstanceRow key={instance.id || instance.cid}
                       instance={instance}
                       onResourceSelected={this.props.onResourceSelected}
                       onResourceDeselected={this.props.onResourceDeselected}
                       onPreviewResource={this.props.onPreviewResource}
                       isPreviewed={isPreviewed}
                       isChecked={isChecked}
          />
        );
      }.bind(this));
    },

    render: function () {
      var instances = this.props.instances,
          instanceRows = this.getInstanceRows(instances);

      return (
        <SelectableTable
          resources={instances}
          selectedResources={this.props.selectedResources}
          resourceRows={instanceRows}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
        >
          <th>Name</th>
          <th>Status</th>
          <th>IP Address</th>
          <th>Size</th>
          <th>Provider</th>
        </SelectableTable>
      )
    }

  });

});
