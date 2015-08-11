define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    VolumeTable = require('./VolumeTable.react'),
    NoVolumeNotice = require('./NoVolumeNotice.react');

  return React.createClass({
    displayName: "VolumeList",

    propTypes: {
      volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    render: function () {
      var volumes = this.props.volumes,
        content;

      if (this.props.volumes.length <= 0) {
        content = (
          <NoVolumeNotice/>
        );
      } else {
        content = (
          <VolumeTable
            volumes={volumes}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}
            onPreviewResource={this.props.onPreviewResource}
            previewedResource={this.props.previewedResource}
            selectedResources={this.props.selectedResources}
            />
        );
      }

      return (
        <div>
          <div className="header">
            <i className="glyphicon glyphicon-hdd"></i>

            <h2>Volumes</h2>
          </div>
          {content}
        </div>
      );
    }

  });

});
