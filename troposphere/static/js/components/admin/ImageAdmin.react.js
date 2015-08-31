define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      actions = require('actions'),
      ResourceActions = require('actions/ResourceActions');

  return React.createClass({

    mixins: [Router.State],

    render: function () {

      return(
        <div className="quota-detail">
          <h1>Image Admin</h1>
        </div>
      );
    }
  });
}); 

