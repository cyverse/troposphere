import React from 'react';
import Router from 'react-router';
import stores from 'stores';
import actions from 'actions';
import ImageRequest from './ImageRequest.react';
import ImageRequestActions from 'actions/ImageRequestActions';

let RouteHandler = Router.RouteHandler;

export default React.createClass({

    mixins: [Router.State],

    loadMoreRequests: function(){
        stores.ImageRequestStore.fetchMoreWhere({status__name: "pending"});
    },

    render: function () {
      var imageRequests = stores.ImageRequestStore.fetchWhere({status__name: "pending"});
      var statuses = stores.StatusStore.getAll();
      var loadMoreButton;

      if (imageRequests == null || !statuses){
        return <div className="loading"></div>
      }

      if (imageRequests.meta.next){
        loadMoreButton = <tr><td><div onClick={this.loadMoreRequests} className="btn btn-default">Load more requests</div></td></tr>;
      }

      if (!imageRequests.models[0]){
        return <div>
                 <h3>No imaging requests</h3>
                 <div className="btn btn-default" onClick = {this.loadMoreRequests}>Refresh</div>
               </div>;
      }

      var mappedImageRequests = imageRequests.map(function(request){
        return <ImageRequest key={request.id} request={request} />;
      });

      return (
        <div className="image-master">
          <h1>Imaging Requests</h1>
              <table className="admin-table table table-hover table-striped col-md-6">
                <tbody>
                  <tr className="admin-row">
                    <th>
                      <h4>User</h4>
                    </th>
                    <th>
                      <h4>Name</h4>
                    </th>
                    <th>
                      <h4>Status</h4>
                    </th>
                  </tr>
                  {mappedImageRequests}
                  {loadMoreButton}
                </tbody>
              </table>
            <RouteHandler />
          </div>
        );
    }
  });
