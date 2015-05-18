define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      actions = require('actions'),
      AllocationActions = require('actions/AllocationActions'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    getInitialState: function() {
      return{
        response: ""
      };
    },

    handleResponseChange: function(event) {
      var response = event.target.value;
      if(response) this.setState({response: response});
    },

    handleAllocationChange: function(event){
      var allocation = event.target.value;
      if(allocation) this.setState({allocation: allocation});
    },

    handleAllocationApproval: function(e){
      e.preventDefault();
      var allocationRequest = stores.AllocationRequestStore.get(this.getParams().allocationRequestId);
      var status = stores.QuotaStatusStore.getStatusWithName("approved");
      AllocationActions.update({request: allocationRequest, response: this.state.response, allocation: this.state.allocation, status: status.id});
    },

    handleAllocationDenial: function(e){
      e.preventDefault();
      var allocationRequest = stores.AllocationRequestStore.get(this.getParams().allocationRequestId);
      var status = stores.QuotaStatusStore.getStatusWithName("rejected");
      AllocationActions.update({request: allocationRequest, response: this.state.response, allocation: this.state.allocation, status: status.id});
    },

    render: function () {
      var allocationRequest = stores.AllocationRequestStore.get(this.getParams().allocationRequestId);
      var allocations = stores.AllocationStore.getAll();
      var statuses = stores.QuotaStatusStore.getAll();

      if(!allocationRequest || !allocations || !statuses) return <div className="loading"></div>;

      return(
        <div className="quota-detail">
          <div><strong>User:</strong> {allocationRequest.get('user').username}</div>
          <div><strong>Created by:</strong> {allocationRequest.get('created_by').username}</div>
          <div><strong>Admin message:</strong> {allocationRequest.get('admin_message')}</div>
          <div><strong>Request:</strong> {allocationRequest.get('request')}</div>
          <div><strong>Description:</strong> {allocationRequest.get('description')}</div>
          <div>
            <label>New allocation:&nbsp;</label>
            <select value={this.state.allocation} onChange={this.handleAllocationChange} ref="selectedAllocation">{allocations.map(function(allocation){
              return(
                <option value={allocation.id} key={allocation.id}>
                  Threshold: {allocation.get('threshold')}&nbsp;
                  Delta: {allocation.get('delta')}&nbsp;
                </option>
              );
            })}
            </select>
          </div>
          <div className="form-group">
            <strong>Response:</strong>
            <br />
            <textarea type="text" form="admin" value={this.state.value} cols="60" rows="8" onChange={this.handleResponseChange} />
          </div>
          <button onClick={this.handleAllocationApproval} type="button" className="btn btn-default btn-sm">Approve</button>
          <button onClick={this.handleAllocationDenial} type="button" className="btn btn-default btn-sm">Deny</button>
        </div>
      );
    }
  });
});
