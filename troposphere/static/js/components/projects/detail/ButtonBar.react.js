/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'context'
  ],
  function (React, Backbone, context) {

    return React.createClass({

      propTypes: {
        isVisible: React.PropTypes.bool.isRequired,
        onMoveSelectedResources: React.PropTypes.func.isRequired,
        onDeleteSelectedResources: React.PropTypes.func.isRequired,
        onReportSelectedResources: React.PropTypes.func.isRequired,
        onRemoveSelectedResources: React.PropTypes.func.isRequired
      },

      render: function () {
        var className = "btn btn-default";
        if(!this.props.isVisible) className += " invisible";

        var removeResourceButton;
        if(context.profile.get('is_superuser') === true){
          removeResourceButton = (
            <button className={className} style={{"background-color": "bisque"}} onClick={this.props.onRemoveSelectedResources}>
              <i className="glyphicon glyphicon-export"/>
            </button>
          );
        }

        return (
          <div className="button-bar">
            <button className="btn btn-default" onClick={this.props.onReportSelectedResources}>
              <i className="glyphicon glyphicon-list-alt"/>
            </button>
            <button className={className} onClick={this.props.onMoveSelectedResources}>
              <i className="glyphicon glyphicon-folder-open"/>
            </button>
            <button className={className} onClick={this.props.onDeleteSelectedResources}>
              <i className="glyphicon glyphicon-trash"/>
            </button>
            {removeResourceButton}
          </div>
        );
      }

    });

  });
