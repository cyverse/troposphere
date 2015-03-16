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

      if(!quotaRequest) return <div className="loading"></div>;

      return(
        <div className="quota-detail">
          <div>ID: {quotaRequest.get('id')}</div>
          <div>Created by: {quotaRequest.get('created_by')}</div>
          <div>Status: {quotaRequest.get('status')}</div>
          <div>Admin message: {quotaRequest.get('admin_message')}</div>
          <div>Quota: {quotaRequest.get('quota')}</div>
          <div>Request: {quotaRequest.get('request')}</div>
          <div className="quota-description">Description: {quotaRequest.get('description')}</div>
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