define(function(require) {

  var React = require('react/addons'),
    moment = require('moment'),
    RefreshComponent = require('components/projects/resources/instance/details/sections/metrics/RefreshComponent.react'),
    stores = require('stores');

  return React.createClass({

    getInitialState: function(){
      // start fetching the relevant models before the component is rendered
      stores.ImageRequestStore.fetchFirstPageWhere({new_machine_owner__username: stores.ProfileStore.get().id});
      return {};
    },

    onEditImage: function(requestId){
      modals.ImageModals.edit(stores.ImageRequestStore.get(requestId));
    },

    refreshHistory: function(){
      stores.ImageRequestStore.fetchFirstPageWhere({new_machine_owner__username: stores.ProfileStore.get().id});
      stores.ImageRequestStore.lastUpdated = Date.now();
      this.forceUpdate();
    },

    renderRefreshButton: function(){
      return (
        <span className="refresh-button">
            <RefreshComponent onRefreshClick = {this.refreshHistory} timestamp = {stores.ImageRequestStore.lastUpdated} delay = {1000 * 30} />
        </span>
      );
    },

    render: function() {
      var username = stores.ProfileStore.get().id,
          imagingDocsUrl = "https://pods.iplantcollaborative.org/wiki/display/atmman/Requesting+an+Image+of+an+Instance";
      
      if(username == null){
        return <div className = "loading"></div>
      }

      var requests = stores.ImageRequestStore.getAll();
      
      if(requests == null){
        return <div className = "loading"></div>;
      }

      if(!requests.models[0]){
        return (
          <div className="container">
            <p style={{marginBottom: "16px"}}>
              {"Looking for more information about the imaging process? Check out the "}
              <a href={imagingDocsUrl} target="_blank">documention on imaging</a>.
            </p>
            <p>You have not made any imaging requests.</p>
          </div>
        );
      }

      var displayRequests = requests.map(function(request){
        
        // set the color of the row based on the status of the request
        var trClass;
        switch(request.get('status').name){
          case "approved":
            trClass = "success";
            break;
          case "failed":
            trClass = "warning"
            break;
          default:
            trClass = "active"
            break;
        }

        var newMachineId = !!request.get('new_machine') ? request.get('new_machine').id : "N/A";

        return <tr className={trClass}>
                    <td>{moment(request.get('start_date')).format("MMM D, YYYY")}</td>
                    <td>#{request.get('instance').id} - {request.get('instance').name}</td>
                    <td>{request.get('status').name}</td>
                    <td>{request.get('old_status')}</td>
                    <td>{newMachineId}</td>
                </tr>
      }.bind(this));
      
      return (
        <div className="container">
          <p style={{marginBottom: "16px"}}>
            {"Looking for more information about the imaging process? Check out the "}
            <a href={imagingDocsUrl} target="_blank">documention on imaging</a>.
          </p>

          {this.renderRefreshButton()}

          <table className = "table table-condensed image-requests">
            <tbody>
              <tr>
                <th>
                  <h3>Date requested</h3>
                </th>
                <th>
                  <h3>Base instance</h3>
                </th>
                <th>
                  <h3>Status</h3>
                </th>
                <th>
                  <h3>Machine State</h3>
                </th>
                <th>
                  <h3>New Machine ID</h3>
                </th>
              </tr>
              {displayRequests}
            </tbody>
          </table>
        </div>
      );
    }

  });

});
