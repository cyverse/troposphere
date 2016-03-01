import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "ProjectsMaster",

    mixins: [Router.State],

    render: function () {
      return (
        <RouteHandler/>
      );
    }

});
