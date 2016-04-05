define(function (require) {

  var React = require('react/addons'),
    ProjectResourcesWrapper = require('./detail/resources/ProjectResourcesWrapper.react'),
    VolumeDetailsView = require('./resources/volume/details/VolumeDetailsView.react'),
    Router = require('react-router'),
    stores = require('stores');

  return React.createClass({
    displayName: "VolumeDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
        volume = stores.VolumeStore.get(Number(this.getParams().volumeId)),
        helpLinks = stores.HelpLinkStore.getAll();

      if (!project || !volume || !helpLinks) {
        return <div className="loading"></div>;
      }

      return (
        <ProjectResourcesWrapper project={project}>
          <VolumeDetailsView project={project} volume={volume}/>
        </ProjectResourcesWrapper>
      );
    }

  });

});
