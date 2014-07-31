/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './sections/VolumeDetailsSection.react',
    './sections/VolumeInfoSection.react',
    'components/projects/common/BreadcrumbBar.react',
    './actions/VolumeActionsAndLinks.react',
    'stores/ProviderStore',
    'stores/VolumeStore',
    'controllers/NotificationController',
    'url'
  ],
  function (React, Backbone, VolumeDetailsSection, VolumeInfoSection, BreadcrumbBar, VolumeActionsAndLinks, ProviderStore, VolumeStore, NotificationController, URL) {

    function getState(project, volumeId) {
      return {
        volume: VolumeStore.get(volumeId),
        volumes: VolumeStore.getVolumesInProject(project),
        providers: ProviderStore.getAll()
      };
    }

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
        volumeId: React.PropTypes.string.isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.project, this.props.volumeId);
      },

      componentDidMount: function () {
        ProviderStore.addChangeListener(this.updateState);
        VolumeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        VolumeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project, this.props.volumeId));
      },

      render: function () {
        //<VolumeDetails volume={volume} providers={this.state.providers}/>
        if(this.state.volumes && this.state.providers && this.state.volume) {
          var volume = this.state.volumes.get(this.props.volumeId);
          if(!volume) NotificationController.error(null, "No volume with id: " + this.props.volumeId);
          volume = this.state.volume;

          var breadcrumbs = [
            {
              name: "Resources",
              url: URL.project(this.props.project)
            },
            {
              name: volume.get('name'),
              url: URL.projectVolume({
                project: this.props.project,
                volume: volume
              })
            }
          ];

          return (
            <div>
              <BreadcrumbBar breadcrumbs={breadcrumbs}/>
              <div className="row resource-details-content">
                <div className="col-md-9 resource-detail-sections">
                  <VolumeInfoSection volume={volume}/>
                  <hr/>
                  <VolumeDetailsSection volume={volume} providers={this.state.providers}/>
                  <hr/>
                </div>
                <div className="col-md-3 resource-actions">
                  <VolumeActionsAndLinks volume={volume} project={this.props.project}/>
                </div>
              </div>
            </div>
          );
        }

        return (
           <div className="loading"></div>
        );
      }

    });

  });
