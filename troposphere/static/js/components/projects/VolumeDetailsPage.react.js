import React from 'react/addons';
import ProjectResourcesWrapper from './detail/resources/ProjectResourcesWrapper.react';
import VolumeDetailsView from './resources/volume/details/VolumeDetailsView.react';
import Router from 'react-router';
import stores from 'stores';

export default React.createClass({
    displayName: "VolumeDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
        volume = stores.VolumeStore.get(Number(this.getParams().volumeId));

      if (!project || !volume) return <div className="loading"></div>;

      return (
        <ProjectResourcesWrapper project={project}>
          <VolumeDetailsView project={project} volume={volume}/>
        </ProjectResourcesWrapper>
      );
    }

});
