import React from 'react';
import ProjectResourcesWrapper from './detail/resources/ProjectResourcesWrapper.react';
import ExternalLinkDetailsView from './resources/link/details/ExternalLinkDetailsView.react';
import Router from 'react-router';
import stores from 'stores';


export default React.createClass({
    displayName: "ExternalLinkDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId));
      var linkId = this.getParams().linkId;
      var link = stores.ExternalLinkStore.get(linkId);

      if (!project || !link) return <div className="loading"></div>;

      return (
        <ProjectResourcesWrapper project={project}>
          <ExternalLinkDetailsView project={project} link={link}/>
        </ProjectResourcesWrapper>
      );
    }
});
