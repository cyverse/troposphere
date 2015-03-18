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
      var quotaRequest = stores.QuotaRequestStore.get(this.getParams().quotaRequestId);
      return{
        request: quotaRequest,
        response: quotaRequest.get("admin_message"),
        quota: quotaRequest.get("quota")
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
      // if there's a new quota set
      if(this.state.quota != this.state.request.get('quota')) {
        QuotaActions.update({request: this.state.request, response: this.state.response, quota: this.state.quota, status: "approved"});
      }
    },

    handleQuotaDenial: function(e){
      e.preventDefault();
      QuotaActions.update({request: this.state.request, response: this.state.response, quota: this.state.request.get('quota'), status: "denied"});
    },

    render: function () {
      var quotaRequest = stores.QuotaRequestStore.get(this.getParams().quotaRequestId);
      var quotas = stores.QuotaStore.getAll();

      if(!quotaRequest || !quotas) return <div className="loading"></div>;

      var currentQuota = (quotas.get(quotaRequest.get('quota')));
      return(
        <div className="quota-detail">
          <div>User: {quotaRequest.get('created_by')}</div>
          <div>Admin message: {quotaRequest.get('admin_message')}</div>
          <div>Request: {quotaRequest.get('request')}</div>
          <div>Current quota:&nbsp;
            CPU: {currentQuota.attributes.cpu}&nbsp;
            Memory: {currentQuota.attributes.memory}&nbsp;
            Storage: {currentQuota.attributes.storage}&nbsp;
            Storage Count: {currentQuota.attributes.storage_count}&nbsp;
            Suspended: {currentQuota.attributes.suspended_count}&nbsp;
          </div>
          <div className="quota-description">Description: {quotaRequest.get('description')}</div>
          <div>
            <label>New quota:&nbsp;</label>
            <select value = {this.state.quota} onChange={this.handleQuotaChange} ref="selectedQuota">{quotas.map(function(quota){
              return(
                <option value={quota.id}>
                  CPU: {quota.attributes.cpu}&nbsp;
                  Memory: {quota.attributes.memory}&nbsp;
                  Storage: {quota.attributes.storage}&nbsp;
                  Storage Count: {quota.attributes.storage_count}&nbsp;
                  Suspended: {quota.attributes.suspended_count}&nbsp;
                </option>
              );
            })}
            </select>
          </div>
          <div class="form-group">
            Response:
            <br />
            <textarea type="text" form="admin" value={this.state.value} cols="60" rows="8" name="email" onChange={this.handleResponseChange} />
          </div>
          <button onClick={this.handleQuotaApproval} type="button" className="btn btn-default btn-sm">Approve</button>
          <button onClick={this.handleQuotaDenial} type="button" className="btn btn-default btn-sm">Deny</button>
        </div>
      );
    }
  });
});