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
        instance = stores.InstanceStore.get(Number(this.getParams().instanceId));

      if (!project || !instance) return <div className="loading"></div>;

      return (
        <ProjectResourcesWrapper project={project}>
          <InstanceDetailsView project={project} instance={instance}/>
        </ProjectResourcesWrapper>
      );
    }

});
