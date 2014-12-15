/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './MaintenanceMessage.react',
    './ImageCreatedMessage.react'
  ],
  function (React, Backbone, MaintenanceMessage, ImageCreatedMessage) {

    return React.createClass({

      propTypes: {
        messages: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderApplicationNotification: function(application){
        return (
          <ImageCreatedMessage key={application.id} application={application}/>
        );
      },

      renderMaintenanceNotification: function(message){
        return (
          <MaintenanceMessage key={message.id} message={message}/>
        );
      },

      render: function () {
        var notifications = [];
        var maintenanceNotifications = this.props.messages.map(this.renderMaintenanceNotification);
        var applicationNotifications = this.props.applications.slice(0,10).map(this.renderApplicationNotification);
        notifications = notifications.concat(maintenanceNotifications, applicationNotifications);

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
                  You will see a notification here when Atmosphere is scheduled to go down for maintenance.
                </span>
              </div>
            </ul>
          )
        }
      }

    });

  });
