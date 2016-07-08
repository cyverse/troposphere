import React from 'react';
import Router from 'react-router';
import RouterInstance from '../../Router';
import ResourceRequest from './ResourceRequest.react';
import stores from 'stores';


let RouteHandler = Router.RouteHandler;

export default React.createClass({

    mixins: [Router.State],

    getInitialState: function(){
        return{
            refreshing: false
        }
    },

    componentDidMount: function(){
        stores.StatusStore.getAll();
    },

    onRefresh: function(){
        this.setState({refreshing: true});
        stores.ResourceRequestStore.fetchFirstPage(function(){
            this.setState({refreshing: false});
        }.bind(this));
    },

    onResourceClick: function(request){
      RouterInstance.getInstance().transitionTo("resource-request-detail", {request: request, id: request.id});
    },

    renderRefreshButton: function(){
        var controlsClass = "glyphicon pull-right glyphicon-refresh" + (this.state.refreshing ? " refreshing" : "");
        return (
            <span className={controlsClass} onClick={this.onRefresh} />
        );
    },

    render: function () {
      var requests = stores.ResourceRequestStore.findWhere({
          'status.name': 'pending'
        }),
        statuses = stores.StatusStore.getAll();

      if (!requests || !statuses) return <div className="loading"></div>;

      var resourceRequests = requests.map((r) => {
        return (
          <li key={r.id} onClick={this.onResourceClick.bind(this, r)}>
            {r.get('created_by').username}
          </li>
        );
      })

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
