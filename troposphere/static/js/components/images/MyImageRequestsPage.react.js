define(function(require) {

  var React = require('react/addons'),
    moment = require('moment'),
    stores = require('stores');

  return React.createClass({

    render: function() {
      var username = stores.ProfileStore.get('username'),
          imagingDocsUrl = "https://pods.iplantcollaborative.org/wiki/display/atmman/Requesting+an+Image+of+an+Instance";
      
      if(username == null){
        return <div className = "loading"></div>
      }

      var requests = stores.ImageRequestStore.fetchWhere({username: username});
      
      if(requests == null){
        return <div className = "loading"></div>;
      }

      if(!requests[0]){
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
        return <tr>
                 <td>{moment(request.get('start_date')).format("MMM D, YYYY")}</td>
                 <td>{request.get('instance').name}</td>
                 <td>{request.get('status')}</td>
                </tr>
      });
      
      return (
        <div className="container">
          <p style={{marginBottom: "16px"}}>
            {"Looking for more information about the imaging process? Check out the "}
            <a href={imagingDocsUrl} target="_blank">documention on imaging</a>.
          </p>
          <table className="quota-table table table-hover col-md-6">
            <tbody>
              <tr className="quota-row">
                <th>
                  <h3>Date requested</h3>
                </th>
                <th>
                  <h3>Base instance</h3>
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

});
