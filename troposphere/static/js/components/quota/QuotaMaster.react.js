define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var quotaRequests = stores.QuotaRequestStore.getAll();

      if(!quotaRequests) return <div className="loading"></div>;

      return (
        <div>
            <h1>Quota!</h1>
            <div>{quotaRequests.toJSON()}</div>
            <RouteHandler/>
        </div>
      );
    }

  });

});