import React from 'react/addons';
import ProjectResourcesWrapper from './detail/resources/ProjectResourcesWrapper.react';
import ProjectDetails from './detail/resources/ProjectDetails.react';
import stores from 'stores';
import Router from 'react-router';

export default React.createClass({
    displayName: "ProjectResouresPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
        helpLinks = stores.HelpLinkStore.getAll();

/* relates to ATMO-1230, links move to atmo-db; pending dev
      if (!project && !helpLinks) {
*/
      if (!project) {
        return (
          <div className="loading"></div>
        );
      }

      return (
        <ProjectResourcesWrapper project={project}>
          <ProjectDetails project={project}/>
        </ProjectResourcesWrapper>
      );
    }

});
