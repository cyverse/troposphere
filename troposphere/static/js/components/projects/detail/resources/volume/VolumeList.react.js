define(function (require) {

  var React = require('react'),
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

    getVolumeContent: function(){
      if(this.props.volumes.length <= 0){
        return (
          <NoVolumeNotice project={this.props.project}/>
        );
      }

      return (
        <VolumeTable
          volumes={this.props.volumes}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
          onPreviewResource={this.props.onPreviewResource}
          previewedResource={this.props.previewedResource}
          selectedResources={this.props.selectedResources}
        />
      );
    },

    render: function () {
      return (
        <div>
          <div className="header">
            <i className="glyphicon glyphicon-hdd"></i>
            <h2>Volumes</h2>
          </div>
          {this.getVolumeContent()}
        </div>
      );
    }

  });

});
