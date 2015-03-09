define(function (require) {
  "use strict";

  var React = require('react'),
      stores = require('stores');

  return React.createClass({

    render: function () {
      return (
        <h2>I am sub component</h2>
      );
    }

  });

});