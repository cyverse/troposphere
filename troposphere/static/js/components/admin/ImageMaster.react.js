define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler,
      actions = require('actions'),
      ImageRequest = require('./ImageRequest.react'),
      ImageRequestActions = require('actions/ImageRequestActions');

  return React.createClass({

    mixins: [Router.State],

    loadMoreRequests: function(){
        stores.ImageRequestStore.fetchMore();
    },

    render: function () {
      var imageRequests = stores.ImageRequestStore.getAll();

      if(imageRequests == null){
        return <div className="loading"></div>
      }

      var mappedImageRequests = imageRequests.map(function(request){
        return <ImageRequest key={request.id} request={request} />;
      });

      return (
        <div className="image-master">
          <h1>Imaging Requests</h1>
              <table className="quota-table table table-hover col-md-6">
                <tbody>
                  <tr className="quota-row">
                    <th className="center">
                      <h3>User</h3>
                    </th>
                    <th className="center">
                      <h3>Name</h3>
                    </th>
                    <th className="center">
                      <h3>Status</h3>
                    </th>
                  </tr>
                  {mappedImageRequests}
                </tbody>
              </table>
              <div onClick={this.loadMoreRequests} className="btn btn-default">Load more requests</div>
            <RouteHandler />
          </div>
        );
    }
  });
});

