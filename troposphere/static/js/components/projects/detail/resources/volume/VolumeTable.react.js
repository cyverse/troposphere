define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      VolumeRow = require('./VolumeRow.react'),
      SelectableTable = require('../SelectableTable.react');

  return React.createClass({
    displayName: "VolumeTable",

    propTypes: {
      volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
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
      var previewedResource = this.props.previewedResource,
          selectedResources = this.props.selectedResources;

      return this.props.volumes.map(function(volume){
        var isPreviewed = (previewedResource === volume),
            isChecked = selectedResources.get(volume) ? true : false;

        return (
          <VolumeRow
            key={volume.id || volume.cid}
            volume={volume}
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
      return (
        <SelectableTable
          resources={this.props.volumes}
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
