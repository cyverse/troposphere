/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        isVisible: React.PropTypes.bool.isRequired
      },

      render: function () {
        var className = "btn btn-default";
        if(!this.props.isVisible) className += " invisible";
        return (
          <div className="button-bar">
            <button className={className}>
              <i className="glyphicon glyphicon-folder-open"/>
            </button>
          </div>
        );
      }

    });

  });
