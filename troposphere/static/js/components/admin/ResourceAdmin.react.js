import React from 'react/addons';
import Router from 'react-router';
import stores from 'stores';
import Glyphicon from 'components/common/Glyphicon.react';
import actions from 'actions';
import ResourceActions from 'actions/ResourceActions';

export default React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
      return {
        AUSearch: "",
        delta: 525600,
        expire: true,
        response: "",
        canSubmit: false,
        newAllocationId: null
      };
    },

    handleResponseChange: function (event) {
      var response = event.target.value;
      if (response) this.setState({response: response});
    },

    handleQuotaChange: function (event) {
      var quota = event.target.value;
      if (quota) this.setState({quota: quota});
    },

    handleAllocationChange: function (event) {
      var allocation = event.target.value;
      if (allocation) this.setState({allocation: allocation});
    },

    handleApproval: function(e){
        e.preventDefault();
        var resourceRequest = stores.ResourceRequestStore.get(this.getParams().resourceRequestId),
          quotaToSend = parseInt(this.state.quota) || parseInt(resourceRequest.get('current_quota')),
          allocationToSend = stores.AllocationStore.findWhere({"threshold": parseInt(this.state.AUSearch) * 60, "delta": this.state.delta}).models[0].get('id');
          status = stores.StatusStore.findOne({name: "approved"});

        ResourceActions.update({
          request: resourceRequest,
          response: this.state.response,
          quota: quotaToSend,
          allocation: allocationToSend,
          status: status.id
        });
    },

    handleDenial: function(e){
      e.preventDefault();
      var resourceRequest = stores.ResourceRequestStore.get(this.getParams().resourceRequestId),
        status = stores.StatusStore.findOne({name: "rejected"});

      ResourceActions.update({
        request: resourceRequest,
        response: this.state.response,
        status: status.id
      });
    },

    handleThresholdSearchChange: function(e){
      this.setState({
        AUSearch: e.target.value
      });
    },

    makeNewAllocation: function(){
      actions.AllocationActions.create({"threshold": this.state.AUSearch * 60, "delta": this.state.delta});
    },

    onExpireChange: function(e){
      // If expire is currently true, we want it to be false. Set delta to -1 for non expiring AU, standard 525600 for expiring.
      this.state.expire ? this.setState({delta: -1}) : this.setState({delta: 525600});
      this.setState({expire: !this.state.expire});
    },

    renderAllocationStatus: function(){
      if(stores.AllocationStore.findWhere({"threshold": parseInt(this.state.AUSearch) * 60, "delta": this.state.delta}).length < 1){
        return(
          <div>
            <p>Allocation with {this.state.AUSearch} AU expiring: {this.state.expire ? "true":"false"} does not exist. Click <a href="#" onClick={this.makeNewAllocation}>here</a> to create it.</p>
          </div>
        );
      }
      else{
        return(
          <div>
            <Glyphicon name="ok" /> Allocation exists
          </div>
        );
      }
    },

    render: function () {
      var quotas = stores.QuotaStore.getAll();
      var allocations = stores.AllocationStore.fetchWhere({"page_size": 100});
      var statuses = stores.StatusStore.getAll();
      var resourceRequest = stores.ResourceRequestStore.get(this.getParams().resourceRequestId);

      if (!resourceRequest || !quotas || !allocations || !statuses) return <div className="loading"/>;

      if (resourceRequest.get('current_quota') && resourceRequest.get('current_allocation')) {

        var currentQuota = stores.QuotaStore.get(resourceRequest.get('current_quota')),
          currentAllocation = stores.AllocationStore.get(resourceRequest.get('current_allocation'));

        if (!currentQuota || !currentAllocation) return <div className="loading"/>;

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

      else {
        var currentQuotaString = 'N/A',
          currentAllocationString = 'N/A';
      }

      var canSubmit = (parseInt(this.state.quota) || parseInt(resourceRequest.get('current_quota'))) && (stores.AllocationStore.findWhere({"threshold": parseInt(this.state.AUSearch) * 60, "delta": this.state.delta}).length == 1) && this.state.response;


      return (
        <div className="row admin-detail">
          <div className="col-md-12"><strong>User:</strong> {resourceRequest.get('user').username}</div>
          <div className="col-md-12"><strong>Created by:</strong> {resourceRequest.get('created_by').username}</div>
          <div className="col-md-12"><strong>Admin message:</strong> {resourceRequest.get('admin_message')}</div>
          <div className="col-md-12"><strong>Request:</strong> {resourceRequest.get('request')}</div>
          <div className="col-md-12"><strong>Description:</strong> {resourceRequest.get('description')}</div>
          <div className="col-md-12"><strong>Current quota:</strong>{currentQuotaString}</div>
          <div className="col-md-12"><strong>Current allocation:</strong>{currentAllocationString}</div>
          <div className="col-md-12">
            <label>New quota:&nbsp;</label>
            <select value={this.state.quota} onChange={this.handleQuotaChange}
              ref="selectedQuota">{quotas.map(function (quota) {
              return (
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
          <div className="col-md-12">
            <label>New allocation:</label>
            <div>
            <input type="text" value={this.state.AUSearch} onChange={this.handleThresholdSearchChange} />AU
            </div>
            <div className="radio-buttons">
            <strong>Expiring allocation?</strong>
            <input type="radio" name="expire" checked={this.state.expire === true} onChange={this.onExpireChange}>Yes</input>
            <input type="radio" name="expire" checked={this.state.expire === false} onChange={this.onExpireChange}>No</input>
            </div>
            {this.renderAllocationStatus()}
          </div>
          <div className="form-group">
            <strong>Response:</strong>
            <br />
            <textarea type="text" form="admin" value={this.state.value} cols="60" rows="8"
                      onChange={this.handleResponseChange}/>
          </div>
          <button disabled={!canSubmit} onClick={this.handleApproval} type="button" className="btn btn-default btn-sm">Approve
          </button>
          <button onClick={this.handleDenial} type="button" className="btn btn-default btn-sm">Deny</button>
        </div>
      );
    }
  });
