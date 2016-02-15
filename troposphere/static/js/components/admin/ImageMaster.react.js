define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      RouterInstance = require('../../Router'),
      stores = require('stores'),
      moment = require('moment'),
      RouteHandler = Router.RouteHandler,
      actions = require('actions'),
      ImageRequest = require('./ImageRequest.react'),
      ImageRequestActions = require('actions/ImageRequestActions');

  return React.createClass({

    mixins: [Router.State],

    componentDidMount: function(){
        stores.StatusStore.getAll();
    },

    onRefresh: function(){
        stores.ImageRequestStore.fetchFirstPage();
    },

    onResourceClick: function(request){
        RouterInstance.getInstance().transitionTo("image-request-detail", {request: request, id: request.id});
    },

    renderRefreshButton: function(){
        return (
            <span className="pull-right glyphicon glyphicon-refresh" onClick={this.onRefresh} />
        );
    },

    render: function () {
      var requests = stores.ImageRequestStore.getAll();

      if (requests == null){
        return <div className="loading"></div>
      }

      var imageRequestRows = requests.map(function (request) {
        var requestDate = moment(request.get('start_date'));
        var now = moment();

        if(requestDate.isBefore(now.subtract(7, 'days')) && request.get('status').name != "pending"){
          return;
        }

        var handleClick = function(){
            this.onResourceClick(request);
        }.bind(this);

        return (
          <li key={request.id} onClick={handleClick}>
            {request.get('new_machine_owner').username} - <strong>{request.get('status').name}</strong>
          </li>
        );
      }.bind(this));

      if (!imageRequestRows[0]) {
        return  (
          <div>
            {this.renderRefreshButton()}
            <h3>No imaging requests</h3>
          </div>
        );
      }

      return (
        <div className="image-master">
          <h2>Imaging Requests {this.renderRefreshButton()}</h2>
          <ul className="requests-list pull-left">
            {imageRequestRows}
          </ul>
          <RouteHandler />
        </div>
      );
    }
  });
});

