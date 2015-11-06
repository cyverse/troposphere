import React from 'react';
import Backbone from 'backbone';
import MaintenanceMessage from './MaintenanceMessage.react';
import ImageCreatedMessage from './ImageCreatedMessage.react';

export default React.createClass({
      displayName: "MaintenanceMessageList",

      propTypes: {
        messages: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderImageNotification: function(image){
        return (
          <ImageCreatedMessage key={image.id} image={image}/>
        );
      },

      renderMaintenanceNotification: function (message) {
        return (
          <MaintenanceMessage key={message.id} message={message}/>
        );
      },

      render: function () {
        var notifications = [];
        var maintenanceNotifications = this.props.messages.map(this.renderMaintenanceNotification);
        var imageNotifications = this.props.images.slice(0,11).map(this.renderImageNotification);
        notifications = notifications.concat(maintenanceNotifications, imageNotifications);

        if (notifications.length > 0) {
          return (
            <ul className="notifications">
              {notifications}
            </ul>
          );
        } else {
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
