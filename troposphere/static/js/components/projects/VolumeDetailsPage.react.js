define(function (require) {

  var React = require('react'),
    ProjectResourcesWrapper = require('./detail/resources/ProjectResourcesWrapper.react'),
    VolumeDetailsView = require('./resources/volume/details/VolumeDetailsView.react'),
    Router = require('react-router'),
    stores = require('stores');

  return React.createClass({

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

});
