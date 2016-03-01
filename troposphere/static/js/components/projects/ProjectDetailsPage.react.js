import React from 'react';
import stores from 'stores';
import ProjectDetailsView from './detail/details/ProjectDetailsView.react';
import Router from 'react-router';

export default React.createClass({
    displayName: "ProjectDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId));

      if (!project) {
        return (
          <div className="loading"></div>
        );
      }

      return (
        <ProjectDetailsView project={project}/>
      );
    }

});
