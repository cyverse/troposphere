define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      VolumeDetailsSection = require('./sections/VolumeDetailsSection.react'),
      VolumeInfoSection = require('./sections/VolumeInfoSection.react'),
      BreadcrumbBar = require('components/projects/common/BreadcrumbBar.react'),
      VolumeActionsAndLinks = require('./actions/VolumeActionsAndLinks.react');

  // var p1 = (
  //   <p>
  //     {
  //     "A volume is available when it is not attached to an instance. " +
  //     "Any newly created volume must be formatted and then mounted after " +
  //     "it has been attached before you will be able to use it."
  //     }
  //   </p>
  // );
  //
  // var links = [
  //   ["Creating a Volume", "https://pods.iplantcollaborative.org/wiki/x/UyWO"],
  //   ["Attaching a Volume to an Instance", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Attachingavolumetoaninstance"],
  //   ["Formatting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Createthefilesystem%28onetimeeventpervolume%29"],
  //   ["Mounting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Mountthefilesystemonthepartition"],
  //   ["Unmounting and Detaching Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Detachingvolumesfrominstances"]
  // ];

  return React.createClass({

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var project = this.props.project,
          volume = this.props.volume;

      var breadcrumbs = [
        {
          name: "Resources",
          linksTo: "project-resources",
          params: {projectId: project.id}
        },
        {
          name: volume.get('name'),
          linksTo: "project-volume-details",
          params: {projectId: project.id, volumeId: volume.id}
        }
      ];

      return (
        <div>
          <BreadcrumbBar breadcrumbs={breadcrumbs}/>
          <div className="row resource-details-content">
            <div className="col-md-9 resource-detail-sections">
              <VolumeInfoSection volume={volume}/>
              <hr/>
              <VolumeDetailsSection volume={volume}/>
              <hr/>
            </div>
            <div className="col-md-3 resource-actions">
              <VolumeActionsAndLinks volume={volume} project={project}/>
            </div>
          </div>
        </div>
      );
    }

  });

});
