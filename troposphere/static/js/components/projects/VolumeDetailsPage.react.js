import React from 'react';
import ProjectResourcesWrapper from './detail/resources/ProjectResourcesWrapper.react';
import VolumeDetailsView from './resources/volume/details/VolumeDetailsView.react';
import Router from 'react-router';
import stores from 'stores';

export default React.createClass({
    displayName: "VolumeDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
        volume = stores.VolumeStore.get(Number(this.getParams().volumeId)),
        helpLinks = stores.HelpLinkStore.getAll();

/* relates to ATMO-1230, links move to atmo-db; pending dev
      if (!project || !volume || !helpLinks) {
*/
      if (!project || !volume) {
        return <div className="loading"></div>;
      }

      return (
        <ProjectResourcesWrapper project={project}>
          <VolumeDetailsView project={project} volume={volume}/>
        </ProjectResourcesWrapper>
      );
    }

});
