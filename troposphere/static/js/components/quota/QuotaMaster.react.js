define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      AllocationRequest = require('./AllocationRequest.react'),
      QuotaRequest = require('./QuotaRequest.react'),
      RouteHandler = Router.RouteHandler;

  var REQUEST_TYPES = [
    {type: "allocation", name: "Allocation"},
    {type: "quota", name: "Quota"}
  ];

  return React.createClass({

    mixins: [Router.State],

    getInitialState: function() {
      return {
        selected: "allocation"
      };
    },

    handleTypeChange: function(event) {
      var type = event.target.value;
      if (type) this.setState({selected: type});
    },

    renderFields: function() {
      var quota_requests = stores.QuotaRequestStore.getAllPending(),
          allocation_requests = stores.AllocationRequestStore.getAllPending(),
          fields = [];

      if (this.state.selected == "allocation" && allocation_requests) {
        fields = allocation_requests.map(function(request) {
          return(
            <AllocationRequest key={request.id} request={request} />
          )
        });
      } else if(quota_requests) {
        fields = quota_requests.map(function(request) {
          return(
            <QuotaRequest key={request.id} request={request} />
          )
        });
      }

      return fields;
    },

    render: function () {
      var statuses = stores.QuotaStatusStore.getAll()
      var types = REQUEST_TYPES.map(function(value) {
        return (
          <option value={value.type} key={value.type}>{value.name}</option>
        );
      });

      var fields = this.renderFields();

      if(!fields || !statuses) return <div className="loading"></div>;

      return (
        <div className = "container">
            <h1>Requests</h1>
            <div>
              <div className={"form-group"}>
                  <label>Request Type:</label>
                  <select value={this.state.selected}
                          onChange={this.handleTypeChange}
                          className={"form-control"}>
                    {types}
                  </select>
                </div>
                <table className="quota-table table table-hover col-md-6">
                  <tbody>
                    <tr className="quota-row">
                        <th className="center">
                            <h3>User</h3>
                        </th>
                        <th className="center">
                            <h3>Request</h3>
                        </th>
                        <th className="center">
                            <h3>Description</h3>
                        </th>
                    </tr>
                    {fields}
                    </tbody>
                </table>
              <RouteHandler/>
            </div>
        </div>
      );
    }

  });

});
