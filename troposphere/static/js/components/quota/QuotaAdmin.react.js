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

    handleChange: function(event) {
      var response = event.target.value;
      this.setState({response: response})
    },

    handleSubmit: function(e) {
      e.preventDefault();
      QuotaActions.update({request: this.props.request, response: this.state.response})
    },

    render: function () {
      var quotaRequest = stores.QuotaRequestStore.get(this.getParams().quotaRequestId);
      this.props.request = quotaRequest;
      var quotas = stores.QuotaStore.getAll();

      if(!quotaRequest || !quotas) return <div className="loading"></div>;

      return(
        <div className="quota-detail">
          <div>Created by: {quotaRequest.get('created_by')}</div>
          <div>Status: {quotaRequest.get('status')}</div>
          <div>Admin message: {quotaRequest.get('admin_message')}</div>
          <div>Request: {quotaRequest.get('request')}</div>
          <div className="quota-description">Description: {quotaRequest.get('description')}</div>
          <div>
            <label>Quota:&nbsp;</label>
            <select>{quotas.map(function(quota){
              return(
                <option>
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
            Response:<br />
            <textarea type="text" form="admin" value={this.state.value} cols="60" rows="5" name="email" onChange={this.handleChange} />
            <form id = "admin" onSubmit={this.handleSubmit}>
              <input type="submit" className="btn btn-default btn-sm" />
            </form>
          </div>
          <button type="button" className="btn btn-default btn-sm">Approve</button>
          <button type="button" className="btn btn-default btn-sm">Deny</button>
        </div>
      );
    }
  });
});