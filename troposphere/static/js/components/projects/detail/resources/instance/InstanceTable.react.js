/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceRow.react',
    './InstanceNotRealRow.react',
    '../SelectableTable.react'
  ],
  function (React, Backbone, InstanceRow, InstanceNotRealRow, SelectableTable) {

    return React.createClass({
      displayName: "InstanceTable",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
      },

      getInstanceRows: function(){
        return this.props.instances.map(function(instance){
          var isPreviewed = (this.props.previewedResource === instance);
          var isChecked = this.props.selectedResources.get(instance) ? true : false;

          if(instance.isRealResource) {
            return (
              <InstanceRow key={instance.id}
                           instance={instance}
                           project={this.props.project}
                           onResourceSelected={this.props.onResourceSelected}
                           onResourceDeselected={this.props.onResourceDeselected}
                           onPreviewResource={this.props.onPreviewResource}
                           providers={this.props.providers}
                           isPreviewed={isPreviewed}
                           isChecked={isChecked}
              />
            );
          }else{
            return (
              <InstanceNotRealRow key={instance.id}
                                  instance={instance}
                                  project={this.props.project}
              />
            );
          }
        }.bind(this));
      },

      render: function () {
        return (
          <SelectableTable resources={this.props.instances}
                           selectedResources={this.props.selectedResources}
                           getResourceRows={this.getInstanceRows}
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

    return InstanceTable;

  });
