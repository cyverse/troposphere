define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    context = require('context'),
    Button = require('./Button.react'),
    RefreshButton = require('./RefreshButton.react'),
    ResourceActionButtons = require('./ResourceActionButtons.react');

  return React.createClass({

    propTypes: {
      isVisible: React.PropTypes.bool.isRequired,
      onMoveSelectedResources: React.PropTypes.func.isRequired,
      onDeleteSelectedResources: React.PropTypes.func.isRequired,
      onReportSelectedResources: React.PropTypes.func.isRequired,
      onRemoveSelectedResources: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {

      // todo: put these back when we can support them properly
      // right now instances can't be deleted with volumes attached,
      // and volumes can't be deleted while attached to an instance
      // handling this in the UI state machine is just to complicated
      // at the moment. It's much easier to control if the user has to
      // delete things individually.
      //
      // <Button
      //   icon="trash"
      //   tooltip="Delete selected resources"
      //   onClick={this.props.onDeleteSelectedResources}
      //   isVisible={this.props.isVisible}
      // />
      //
      // <Button
      //   icon="list-alt"
      //   tooltip="Report issue with project or selected resources"
      //   onClick={this.props.onReportSelectedResources}
      //   isVisible={true}
      // />

      return (
        <div className="button-bar">
          <RefreshButton/>
          <Button
            icon="folder-open"
            tooltip="Move selected resources"
            onClick={this.props.onMoveSelectedResources}
            isVisible={this.props.isVisible}
            />
          <Button
            icon="export"
            tooltip="Remove selected resources (admin only)"
            onClick={this.props.onRemoveSelectedResources}
            style={{"backgroundColor": "bisque"}}
            isVisible={context.profile.get('is_superuser') && this.props.isVisible}
            />
          <ResourceActionButtons
            onUnselect={this.props.onUnselect}
            previewedResource={this.props.previewedResource}
            project={this.props.project}
            />
        </div>
      );
    }

  });

});
