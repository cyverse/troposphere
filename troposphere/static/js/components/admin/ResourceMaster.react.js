define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    RouterInstance = require('../../Router'),
    stores = require('stores'),
    ResourceRequest = require('./ResourceRequest.react'),
    RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    componentDidMount: function(){
        stores.StatusStore.getAll();
    },

    onRefresh: function(){
        stores.ResourceRequestStore.fetchFirstPage();
    },

    onResourceClick: function(request){
      RouterInstance.getInstance().transitionTo("resource-request-detail", {request: request, id: request.id});
    },

    renderRefreshButton: function(){
        return (
            <span className="pull-right glyphicon glyphicon-refresh" onClick={this.onRefresh} />
        );
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
          <li key={request.id} onClick={handleClick}>
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
          <h2>Resource Requests {this.renderRefreshButton()}</h2>
          <ul className="requests-list pull-left">
            {resourceRequests}
          </ul>
          <RouteHandler />
        </div>
      );
    }

  });

});
