/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './VolumeDetails.react',
    'stores/ProjectVolumeStore',
    'stores/ProviderStore',
    'controllers/NotificationController'
  ],
  function (React, Backbone, VolumeDetails, ProjectVolumeStore, ProviderStore, NotificationController) {

    function getState(project) {
      return {
        volumes: ProjectVolumeStore.getVolumesInProject(project),
        providers: ProviderStore.getAll()
      };
    }

    return React.createClass({

      propTypes: {
        volumeId: React.PropTypes.string.isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.project);
      },

      componentDidMount: function () {
        ProjectVolumeStore.addChangeListener(this.onUpdate);
        ProviderStore.addChangeListener(this.onUpdate);
      },

      componentWillUnmount: function () {
        ProjectVolumeStore.removeChangeListener(this.onUpdate);
        ProviderStore.addChangeListener(this.onUpdate);
      },

      onUpdate: function(){
        if (this.isMounted()) this.setState(getState(this.props.project));
      },

      render: function () {
        if(this.state.volumes && this.state.providers) {
          var volume = this.state.volumes.get(this.props.volumeId);
          if(!volume) NotificationController.error(null, "No volume with id: " + this.props.volumeId);
          return (
            <VolumeDetails volume={volume} providers={this.state.providers}/>
          );
        }

        return (
           <div className="loading"></div>
        );
      }

    });

  });
