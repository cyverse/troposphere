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

    getInitialState: function(){
        return{
            requests: stores.ImageRequestStore.getAll()
        }
    },
    loadMoreRequests: function(){
        this.setState({requests: stores.ImageRequestStore.fetchMore()});
    },

    render: function () {
      var imageRequests = this.state.requests;//stores.ImageRequestStore.getAll();
      console.log("YO");
      if(!imageRequests){
        return <div className="loading"></div>
      }
      var mappedImageRequests = imageRequests.map(function(request){
        return <ImageRequest key={request.id} request={request} />;
      });
      
      if (!mappedImageRequests[0]) {
        mappedImageRequests =
          <tr>
            <td className="user-name">No requests</td>
            <td className="request"></td>
            <td className="description"></td>
          </tr>
      } 

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

