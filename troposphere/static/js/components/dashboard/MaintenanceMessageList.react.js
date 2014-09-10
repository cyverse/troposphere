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
        var notifications = this.props.messages.map(function (message) {
          return (
            <MaintenanceMessage message={message}/>
            );
        }.bind(this));

        if (notifications.length > 0) {
          return (
            <ul className="notifications">
              {notifications}
            </ul>
          );
        }else{
          return (
            <ul className="notifications">
              <div className="preview-message">
                <span className="message">
                  You will see a notiication here when Atmosphere is scheduled to go down for maintence.
                </span>
              </div>
            </ul>
          )
        }
      }

    });

  });
