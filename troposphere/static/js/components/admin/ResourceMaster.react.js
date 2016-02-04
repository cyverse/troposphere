define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    OtherRouter = require('../../Router'),
    stores = require('stores'),
    ResourceRequest = require('./ResourceRequest.react'),
    RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    getInitialState: function(){
      return{
        statusTypes: null,
        requests: null
      }
    },

    onResourceClick: function(request){
      OtherRouter.getInstance().transitionTo("resource-request-detail", {request: request, id: request.id});
    },

    render: function () {
      var requests = stores.ResourceRequestStore.findWhere({
          'status.name': 'pending'
        }),
        statuses = stores.StatusStore.getAll();

      if (!requests || !statuses) return <div className="loading"></div>;

      var resourceRequests = requests.map(function (request) {
        var handleClick = function(){
          this.onResourceClick(request);
        }.bind(this);

        return (
          <li onClick={handleClick}>
            {request.get('created_by').username}
          </li>
        );
      }.bind(this));

      if (!resourceRequests[0]) {
        return  (
          <div>
            <h3>No resource requests</h3>
          </div>
        );
      }

      return (
        <div className="resource-master">
          <h3>Resource Requests</h3>
          <ul className="requests-list pull-left">
            {resourceRequests}
          </ul>
          <RouteHandler /> 
        </div>
      );
    }

  });

});
