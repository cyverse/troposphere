define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      actions = require('actions'),
      QuotaActions = require('actions/QuotaActions'),
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

    handleQuotaChange: function(event){
      var quota = event.target.value;
      if(quota) this.setState({quota: quota});
    },

    handleQuotaApproval: function(e){
      e.preventDefault();
      var quotaRequest = stores.QuotaRequestStore.get(this.getParams().resourceRequestId);
      var status = stores.QuotaStatusStore.findOne({name: "approved"});
      QuotaActions.update({request: quotaRequest, response: this.state.response, quota: this.state.quota, status: status.id});
    },

    handleQuotaDenial: function(e){
      e.preventDefault();
      var quotaRequest = stores.QuotaRequestStore.get(this.getParams().resourceRequestId);
      var status = stores.QuotaStatusStore.findOne({name: "rejected"});
      QuotaActions.update({request: quotaRequest, response: this.state.response, quota: this.state.quota, status: status.id});
    },

    render: function () {
      var quotaRequest = stores.QuotaRequestStore.get(this.getParams().resourceRequestId);
      var quotas = stores.QuotaStore.getAll();
      var statuses = stores.QuotaStatusStore.getAll();

      if(!quotaRequest || !quotas || !statuses) return <div className="loading"></div>;

      return(
        <div className="quota-detail">
          <div><strong>User:</strong> {quotaRequest.get('user').username}</div>
          <div><strong>Created by:</strong> {quotaRequest.get('created_by').username}</div>
          <div><strong>Admin message:</strong> {quotaRequest.get('admin_message')}</div>
          <div><strong>Request:</strong> {quotaRequest.get('request')}</div>
          <div><strong>Description:</strong> {quotaRequest.get('description')}</div>
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
          <div className="form-group">
            <strong>Response:</strong>
            <br />
            <textarea type="text" form="admin" value={this.state.value} cols="60" rows="8" onChange={this.handleResponseChange} />
          </div>
          <button onClick={this.handleQuotaApproval} type="button" className="btn btn-default btn-sm">Approve</button>
          <button onClick={this.handleQuotaDenial} type="button" className="btn btn-default btn-sm">Deny</button>
        </div>
      );
    }
  });
});