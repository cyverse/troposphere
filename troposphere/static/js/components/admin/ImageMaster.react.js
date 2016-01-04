define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      moment = require('moment'),
      RouteHandler = Router.RouteHandler,
      actions = require('actions'),
      ImageRequest = require('./ImageRequest.react'),
      ImageRequestActions = require('actions/ImageRequestActions');

  return React.createClass({

    mixins: [Router.State],

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

        return (
          <ImageRequest key={request.id} request={request}/>
        )
      });

      if (!imageRequestRows[0]) {
        return  (
          <div>
            <h3>No resource requests</h3>
          </div>
        );
      }

      return (
        <div className="image-master">
          <h1>Imaging Requests</h1>
          <ul className="requests">
            <li>
              <h3>User</h3>
              <h3>Name</h3>
              <h3>Status</h3>
            </li>
            {imageRequestRows}
          </ul>
          <RouteHandler />
        </div>
      );
    }
  });
});

