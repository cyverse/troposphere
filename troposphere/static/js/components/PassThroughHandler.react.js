import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "PassThroughHandler",

    render: function () {
      return (
        <RouteHandler/>
      );
    }
});
