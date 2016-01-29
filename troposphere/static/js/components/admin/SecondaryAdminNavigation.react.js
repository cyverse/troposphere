define(function (require) {

  var React = require('react/addons'),
    stores = require('stores'),
    Router = require('react-router'),
    Glyphicon = require('components/common/Glyphicon.react'),
    context = require('context');

  return React.createClass({
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
      var requests = stores.ResourceRequestStore.fetchWhere({
          'status__name': 'pending'
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

});
