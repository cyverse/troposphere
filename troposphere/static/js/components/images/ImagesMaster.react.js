import React from 'react';
import Router from 'react-router';
import SecondaryImageNavigation from './common/SecondaryImageNavigation.react';

let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "ImagesMaster",

    render: function () {
      return (
        <div>
          <SecondaryImageNavigation currentRoute="todo-remove-this"/>
          <RouteHandler/>
        </div>
      );
    }
});
