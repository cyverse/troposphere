import React from 'react';
import Router from 'react-router';
import SecondaryProjectNavigation from '../common/SecondaryProjectNavigation.react';
import stores from 'stores';

let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "ProjectDetailsMaster",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId));

      if (!project) {
        return (
          <div className="loading"></div>
        )
      }

      return (
        <div className="project-details">
          <SecondaryProjectNavigation project={project} currentRoute="todo-remove-this"/>
          <RouteHandler/>
        </div>
      );
    }
});
