/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'context',
    './Button.react'
  ],
  function (React, Backbone, context, Button) {

    return React.createClass({

      propTypes: {
        isVisible: React.PropTypes.bool.isRequired,
        onMoveSelectedResources: React.PropTypes.func.isRequired,
        onDeleteSelectedResources: React.PropTypes.func.isRequired,
        onReportSelectedResources: React.PropTypes.func.isRequired,
        onRemoveSelectedResources: React.PropTypes.func.isRequired
      },

      render: function () {
        return (
          <div className="button-bar">
            <Button icon="list-alt"
                    tooltip="Report issue with project or selected resources"
                    onClick={this.props.onReportSelectedResources}
                    isVisible={true}
            />
            <Button icon="folder-open"
                    tooltip="Move selected resources"
                    onClick={this.props.onMoveSelectedResources}
                    isVisible={this.props.isVisible}
            />
            <Button icon="trash"
                    tooltip="Delete selected resources"
                    onClick={this.props.onDeleteSelectedResources}
                    isVisible={this.props.isVisible}
            />
            <Button icon="export"
                    tooltip="Remove selected resources (admin only)"
                    onClick={this.props.onRemoveSelectedResources}
                    style={{"background-color": "bisque"}}
                    isVisible={context.profile.get('is_superuser') && this.props.isVisible}
            />
          </div>
        );
      }

    });

  });
