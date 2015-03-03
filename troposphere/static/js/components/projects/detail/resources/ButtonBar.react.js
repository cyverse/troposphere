/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'context',
    './Button.react',
    './RefreshButton.react',
    './ResourceActionButtons.react'
  ],
  function (React, Backbone, context, Button, RefreshButton, ResourceActionButtons) {

    return React.createClass({

      propTypes: {
        isVisible: React.PropTypes.bool.isRequired,
        onMoveSelectedResources: React.PropTypes.func.isRequired,
        onDeleteSelectedResources: React.PropTypes.func.isRequired,
        onReportSelectedResources: React.PropTypes.func.isRequired,
        onRemoveSelectedResources: React.PropTypes.func.isRequired
      },

      render: function () {

        // todo: put this back when we can support it properly
        // right now instances can't be deleted with volumes attached,
        // and volumes can't be deleted while attached to an instance
        // handling this in the UI state machine is just to complicated
        // at the moment. It's much easier to control if the user has to
        // delete things individually.
        //
        //<Button icon="trash"
        //        tooltip="Delete selected resources"
        //        onClick={this.props.onDeleteSelectedResources}
        //        isVisible={this.props.isVisible}
        ///>

        return (
          <div className="button-bar">
            <RefreshButton/>
            <Button icon="list-alt"
                    tooltip="Report issue with project or selected resources"
                    onClick={this.props.onReportSelectedResources}
                    isVisible={false}
            />
            <Button icon="folder-open"
                    tooltip="Move selected resources"
                    onClick={this.props.onMoveSelectedResources}
                    isVisible={this.props.isVisible}
            />
            <Button icon="export"
                    tooltip="Remove selected resources (admin only)"
                    onClick={this.props.onRemoveSelectedResources}
                    style={{"backgroundColor": "bisque"}}
                    isVisible={context.profile.get('is_superuser') && this.props.isVisible}
            />
            <ResourceActionButtons
              previewedResource={this.props.previewedResource}
              project={this.props.project}
            />
          </div>
        );
      }

    });

  });
