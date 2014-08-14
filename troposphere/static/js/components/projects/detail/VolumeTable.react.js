/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './VolumeRow.react',
    './VolumeNotRealRow.react',
    './SelectableTable.react'
  ],
  function (React, Backbone, VolumeRow, VolumeNotRealRow, SelectableTable) {

    return React.createClass({
      displayName: "VolumeTable",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection),
        instances: React.PropTypes.instanceOf(Backbone.Collection)
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        this.setState({isChecked: !this.state.isChecked});
      },

      getVolumeRows: function(){
        return this.props.volumes.map(function(volume){
          var isPreviewed = (this.props.previewedResource === volume);
          var isChecked = this.props.selectedResources.get(volume) ? true : false;

          if(volume.isRealResource) {
            return (
              <VolumeRow key={volume.id}
                         volume={volume}
                         project={this.props.project}
                         onResourceSelected={this.props.onResourceSelected}
                         onResourceDeselected={this.props.onResourceDeselected}
                         providers={this.props.providers}
                         isPreviewed={isPreviewed}
                         isChecked={isChecked}
                         instances={this.props.instances}
              />
            );
          }else{
            return (
              <VolumeNotRealRow key={volume.id}
                                volume={volume}
                                project={this.props.project}
              />
            );
          }
        }.bind(this));
      },

      render: function () {
        return (
          <SelectableTable resources={this.props.volumes}
                           selectedResources={this.props.selectedResources}
                           getResourceRows={this.getVolumeRows}
                           onResourceSelected={this.props.onResourceSelected}
                           onResourceDeselected={this.props.onResourceDeselected}
          >
            <th>Name</th>
            <th>Status</th>
            <th>Size</th>
            <th>Provider</th>
          </SelectableTable>
        )
      }

    });

  });
