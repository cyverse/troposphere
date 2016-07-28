import React from 'react';
import stores from 'stores';
import Router from 'react-router';
import Glyphicon from 'components/common/Glyphicon.react';
import context from 'context';


export default React.createClass({
    displayName: "SecondaryAdminNav",


    renderRoute: function (name, linksTo, icon) {

      return (
        <li key={name}>
          <Router.Link to={linksTo}>
            <Glyphicon name={icon}/>
            <span>{name}</span>
          </Router.Link>
        </li>
      )
    },

    render: function () {
      var request_count = null,
          requests = stores.ResourceRequestStore.findWhere({
          'status.name': 'pending'
        });
      if (!requests) {
          request_count = "..."
      } else {
        request_count = requests.length
      }

      var resourcesText = "Resource Requests (" + request_count + ")";
      return (
        <div>
          <div className="secondary-nav">
            <div className="container">
              <ul className="secondary-nav-links">
                {this.renderRoute("Manage Users", "atmosphere-user-manager", "user")}
                {this.renderRoute("Manage Identities", "identity-membership-manager", "user")}
                {this.renderRoute(resourcesText, "resource-request-manager", "tasks")}
                {this.renderRoute("Imaging Requests", "image-request-manager", "floppy-disk")}
              </ul>
            </div>
          </div>
        </div>
      );
    }
});
