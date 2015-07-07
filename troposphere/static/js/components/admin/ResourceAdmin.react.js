define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      actions = require('actions'),
      ResourceActions = require('actions/ResourceActions');

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

    handleQuotaChange: function(event){
      var quota = event.target.value;
      if(quota) this.setState({quota: quota});
    },

    handleAllocationChange: function(event){
      var allocation = event.target.value;
      if(allocation) this.setState({allocation: allocation});
    },

    handleResponseSubmission: function(e){
      e.preventDefault();
      var resourceRequest = stores.ResourceRequestStore.get(this.getParams().resourceRequestId),
          quotaToSend = resourceRequest.get('current_quota'),
          allocationToSend = resourceRequest.get('current_allocation'),
          status = stores.QuotaStatusStore.findOne({name: "rejected"});

      if(e.target.innerHTML === 'Approve'){
          quotaToSend = parseInt(this.state.quota) || parseInt(resourceRequest.get('current_quota'));
          allocationToSend = parseInt(this.state.allocation) || parseInt(resourceRequest.get('current_allocation'));
          status = stores.QuotaStatusStore.findOne({name: "approved"});
      }

      ResourceActions.update({request: resourceRequest, response: this.state.response, quota: quotaToSend, allocation: allocationToSend, status: status.id});
    },

    render: function () {

      var quotas = stores.QuotaStore.getAll();
      var allocations = stores.AllocationStore.getAll();
      var statuses = stores.QuotaStatusStore.getAll();
      var resourceRequest = stores.ResourceRequestStore.get(this.getParams().resourceRequestId);

      if(!resourceRequest || !quotas || !allocations || !statuses) return <div className="loading" />;

      if(resourceRequest.get('current_quota') && resourceRequest.get('current_allocation')) {

        var currentQuota = stores.QuotaStore.get(resourceRequest.get('current_quota')),
          currentAllocation = stores.AllocationStore.get(resourceRequest.get('current_allocation'));

        if (!currentQuota || !currentAllocation) return <div className="loading" />;

        var currentCPU = "  CPU: " + currentQuota.get('cpu'),
          currentMemory = "  Memory: " + currentQuota.get('memory'),
          currentStorage = "  Storage: " + currentQuota.get('storage'),
          currentStorageCount = "  Storage Count: " + currentQuota.get('storage_count'),
          currentSuspendedCount = "  Suspended: " + currentQuota.get('suspended_count'),
          currentThreshold = "  Threshold: " + currentAllocation.get('threshold') + " (" + (currentAllocation.get('threshold') / 60) + " AU)",
          currentDelta = "  Delta: " + currentAllocation.get('delta');

        var currentQuotaString = currentCPU + currentMemory + currentStorage + currentStorageCount + currentSuspendedCount,
          currentAllocationString = currentThreshold + currentDelta;

      }

      else{
        var currentQuotaString = 'N/A',
            currentAllocationString = 'N/A';
      }

      return(
        <div className="quota-detail">
          <div><strong>User:</strong> {resourceRequest.get('user').username}</div>
          <div><strong>Created by:</strong> {resourceRequest.get('created_by').username}</div>
          <div><strong>Admin message:</strong> {resourceRequest.get('admin_message')}</div>
          <div><strong>Request:</strong> {resourceRequest.get('request')}</div>
          <div><strong>Description:</strong> {resourceRequest.get('description')}</div>
          <div><strong>Current quota:</strong>{currentQuotaString}</div>
          <div><strong>Current allocation:</strong>{currentAllocationString}</div>
          <div>
            <label>New quota:&nbsp;</label>
            <select value={this.state.quota} onChange={this.handleQuotaChange} ref="selectedQuota">{quotas.map(function(quota){
              return(
                <option value={quota.id} key={quota.id}>
                  CPU: {quota.get('cpu')}&nbsp;
                  Memory: {quota.get('memory')}&nbsp;
                  Storage: {quota.get('storage')}&nbsp;
                  Storage Count: {quota.get('storage_count')}&nbsp;
                  Suspended: {quota.get('suspended_count')}&nbsp;
                </option>
              );
            })}
            </select>
          </div>
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
          <button onClick={this.handleResponseSubmission} type="button" className="btn btn-default btn-sm">Approve</button>
          <button onClick={this.handleResponseSubmission} type="button" className="btn btn-default btn-sm">Deny</button>
        </div>
      );
    }
  });
});