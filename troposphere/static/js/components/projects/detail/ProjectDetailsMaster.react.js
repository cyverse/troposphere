import React from 'react';
import Router from 'react-router';
import ResourcesHeader from '../common/ResourcesHeader.react';
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
          <ResourcesHeader project = { project } />
          <RouteHandler project = { project } />
        </div>
      );
    }
});
