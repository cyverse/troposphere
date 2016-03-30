import React from 'react/addons';
import stores from 'stores';
import ProjectResourcesWrapper from './detail/resources/ProjectResourcesWrapper.react';
import InstanceDetailsView from './resources/instance/details/InstanceDetailsView.react';
import Router from 'react-router';

export default React.createClass({
    displayName: "InstanceDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
        instance = stores.InstanceStore.get(Number(this.getParams().instanceId)),
        helpLinks = stores.HelpLinkStore.getAll();

/* relates to ATMO-1230, links move to atmo-db; pending dev
      if (!project || !instance || !helpLinks) {
*/

      if (!project || !instance) {
        return <div className="loading"></div>;
      }

      return (
        <ProjectResourcesWrapper project={project}>
          <InstanceDetailsView project={project} instance={instance}/>
        </ProjectResourcesWrapper>
      );
    }

});
