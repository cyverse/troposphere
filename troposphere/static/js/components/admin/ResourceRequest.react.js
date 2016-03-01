import React from 'react/addons';
import Backbone from 'backbone';
import Router from 'react-router';
import stores from 'stores';
import Glyphicon from 'components/common/Glyphicon.react';
import actions from 'actions';
import ResourceActions from 'actions/ResourceActions';

let RouteHandler = Router.RouteHandler;

export default React.createClass({

    mixins: [Router.State],

    getInitialState: function(){
      return {
        AUSearch: 0,
        delta: 525600,
        expire: true,
        response: "",
        canSubmit: false,
        newAllocationId: null,
        displayAdmin: false
      };
    },

    handleDisplayChange: function (event){
      this.setState({displayAdmin: !this.state.displayAdmin});
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

        var resourceRequest = this.props.request,
          quotaToSend = parseInt(this.state.quota) || parseInt(resourceRequest.get('current_quota')),
          allocationToSend = stores.AllocationStore.findWhere({
            "threshold": parseInt(this.state.AUSearch) * 60,
            "delta": this.state.delta
          }).models[0].get('id');
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

      var resourceRequest = this.props.request,
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

    renderAdminDetails: function(){
      var request = stores.ResourceRequestStore.get(this.getParams().id),
          quotas = stores.QuotaStore.getAll(),
          allocations = stores.AllocationStore.fetchWhere({"page_size": 100}),
          statuses = stores.StatusStore.getAll(),
          currentQuotaString = 'N/A',
          currentAllocationString = 'N/A';


      if (!quotas || !allocations || !statuses) return <div className="loading"/>;

      if (request.get('current_quota') && request.get('current_allocation')) {

        var currentQuota = stores.QuotaStore.get(request.get('current_quota')),
            currentAllocation = stores.AllocationStore.get(request.get('current_allocation'));

        if (!currentQuota || !currentAllocation) return <div className="loading"/>;

        var currentCPU = "  CPU: " + currentQuota.get('cpu'),
          currentMemory = "  Memory: " + currentQuota.get('memory'),
          currentStorage = "  Storage: " + currentQuota.get('storage'),
          currentStorageCount = "  Storage Count: " + currentQuota.get('storage_count'),
          currentSuspendedCount = "  Suspended: " + currentQuota.get('suspended_count'),
          currentThreshold = "  Threshold: " + currentAllocation.get('threshold') + " (" + (currentAllocation.get('threshold') / 60) + " AU)",
          currentDelta = "  Delta: " + currentAllocation.get('delta'),
          currentQuotaString = currentCPU + currentMemory + currentStorage + currentStorageCount + currentSuspendedCount,
          currentAllocationString = currentThreshold + currentDelta;
      }

      var canSubmit = (parseInt(this.state.quota) || parseInt(request.get('current_quota'))) && (stores.AllocationStore.findWhere({"threshold": parseInt(this.state.AUSearch) * 60, "delta": this.state.delta}).length == 1) && this.state.response;

      return(
          <div className="admin-detail">
            <div className="request-info">
              <div className="user-info">
                <span className="name"><h4>For user:</h4>&nbsp;<h5>{request.get('user').username}</h5></span>
                <span className="name"><h4>Created by:</h4>&nbsp;<h5>{request.get('created_by').username}</h5></span>
              </div>
              <h4>Request: </h4><h5>{request.get('request')}</h5>
              <h4>Description: </h4><h5>{request.get('description')}</h5>
              <h4>Admin message: </h4><h5>{request.get('admin_message')}</h5>
              <h4>Current quota: </h4><h5>{currentQuotaString}</h5>
              <h4>Current allocation: </h4><h5>{currentAllocationString}</h5>
            </div>
            <div className="request-actions">
              <div>
                <h4>New quota: </h4>
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
              <div>
                <div className="inline">
                  <h4>New allocation: </h4>
                  <div>
                    <input type="Number" value={this.state.AUSearch} onChange={this.handleThresholdSearchChange} />AU
                  </div>
                </div>
                <div className="radio-buttons">
                  <h4>Expiring allocation? </h4>
                  <input type="radio" name="expire" checked={this.state.expire === true} onChange={this.onExpireChange}>Yes</input>
                  <input type="radio" name="expire" checked={this.state.expire === false} onChange={this.onExpireChange}>No</input>
                </div>
                {this.renderAllocationStatus()}
              </div>
              <div className="form-group">
                <h4>Response:</h4>
                <br />
                <textarea type="text" form="admin" value={this.state.value} onChange={this.handleResponseChange}/>
              </div>
              <div className="buttons">
                <button disabled={!canSubmit} onClick={this.handleApproval} type="button" className="btn btn-default btn-sm">Approve</button>
                <button onClick={this.handleDenial} type="button" className="btn btn-default btn-sm">Deny</button>
              </div>
            </div>
          </div>
        );
    },

    render: function () {
      return (
        <div className="request-admin pull-right">
          {this.renderAdminDetails()}
          <RouteHandler />
        </div>
      );
    }
});
