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
        <div className="quota-detail">Hey you clicked id {quotaRequest.id}</div>
      );
    }

  });

});