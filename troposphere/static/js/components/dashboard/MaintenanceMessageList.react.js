/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './MaintenanceMessage.react'
  ],
  function (React, Backbone, MaintenanceMessage) {

    return React.createClass({

      propTypes: {
        messages: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var notifications = this.props.messages.map(function(message) {
          return (
            <MaintenanceMessage message={message}/>
          );
        }.bind(this));

        var title = "Total Resources in Use";

        return (
          <ul className="notifications">
            {notifications}
          </ul>
        );
      }

    });

  });
