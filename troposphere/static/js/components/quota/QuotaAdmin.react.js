define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var quotaRequest = stores.QuotaRequestStore.get(this.getParams().quotaRequestId);
      var quotas = stores.QuotaStore.getAll();
      if(!quotaRequest || !quotas) return <div className="loading"></div>;

      console.log(quotas);
      return(
        <div className="quota-detail">
          <div>Created by: {quotaRequest.get('created_by')}</div>
          <div>Status: {quotaRequest.get('status')}</div>
          <div>Admin message: {quotaRequest.get('admin_message')}</div>
          <div>Request: {quotaRequest.get('request')}</div>
          <div className="quota-description">Description: {quotaRequest.get('description')}</div>
          <div>
            <label>Quota</label>
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
          <form>
            Send email:<br />
              <textarea type="text" cols="60" rows="5" name="email" />
          </form>
          <button type="button">Approve</button>
          <button type="button">Deny</button>
        </div>
      );
    }
  });
});