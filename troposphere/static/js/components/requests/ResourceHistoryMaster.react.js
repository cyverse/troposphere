import React from 'react';
import stores from 'stores';
import ResourceActions from 'actions/ResourceActions';
import Router from 'react-router';


export default React.createClass({
    displayName: "MyResourceRequestsPage",

    mixins: [Router.State],

    closeRequest: function(request){
      var closedStatus = stores.StatusStore.findWhere({"name": "closed"}).models[0].id;
      ResourceActions.close({request: request, status: closedStatus});
    },

    render: function() {
      var username = stores.ProfileStore.get().id,
          statusTypes = stores.StatusStore.getAll();

      if(username == null || !statusTypes){
        return <div className="loading"></div>
      }

      var requests = stores.ResourceRequestStore.findWhere({"created_by.username": username});


      if(requests == null){
        return <div className="loading"></div>;
      }

      if(!requests.models[0]){
        return (
          <div className="container">
            <p>You have not made any resource requests.</p>
          </div>
        );
      }

      var displayRequests = requests.map(function(request){

        // Handler to allow close buton to call React class closeRequest with the proper argument
        var close = function(){
          this.closeRequest(request)
        }.bind(this);

        var closeButton;
        var text = request.get('status').name;

        // set the color of the row based on the status of the request
        var trClass = "active";

        if(text === 'approved'){
          trClass = "success";
        }
        else if (text === "rejected"){
          trClass = "rejected";
        }
        else if(text === "pending"){
          closeButton = <button type="button" className="btn btn-warning pull-right" onClick={close}>Close</button>;
        }

        return (
          <tr key={request.id} className={trClass}>
            <td className="col-md-5">{request.get('request')}</td>
            <td className="col-md-5">{request.get('description')}</td>
            <td className="col-md-2">{request.get('status').name} {closeButton}</td>
          </tr>
        );

      }.bind(this));

      return (
        <div className="container">
          <table className = "table table-condensed image-requests">
            <tbody>
              <tr>
                <th>
                  <h3>Request</h3>
                </th>
                <th>
                  <h3>Reason</h3>
                </th>
                <th>
                  <h3>Status</h3>
                </th>
              </tr>
              {displayRequests}
            </tbody>
          </table>
        </div>
      );
    }
});
