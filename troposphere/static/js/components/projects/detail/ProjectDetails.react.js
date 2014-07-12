/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceTable.react',
    './VolumeTable.react',
    './PreviewPanel.react',
    './SubMenu.react',
    './ButtonBar.react',
    'stores/ProjectInstanceStore',
    'stores/ProjectVolumeStore'
  ],
  function (React, Backbone, InstanceTable, VolumeTable, PreviewPanel, SubMenu, ButtonBar, ProjectInstanceStore, ProjectVolumeStore) {

    function getState(project) {
      return {
        instances: ProjectInstanceStore.getInstancesInProject(project),
        volumes: ProjectVolumeStore.getVolumesInProject(project),
        selectedResource: null
      };
    }

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.project);
      },

      componentDidMount: function () {
        ProjectInstanceStore.addChangeListener(this.onUpdate);
        ProjectVolumeStore.addChangeListener(this.onUpdate);
      },

      componentWillUnmount: function () {
        ProjectInstanceStore.removeChangeListener(this.onUpdate);
        ProjectVolumeStore.removeChangeListener(this.onUpdate);
      },

      onUpdate: function(){
        if (this.isMounted()) this.setState(getState(this.props.project));
      },

      onResourceSelected: function(resource){
        this.setState({selectedResource: resource});
      },

      render: function () {
        if(this.state.instances && this.state.volumes) {
          return (
            <div className="project-content">
              <ButtonBar/>
              <div className="resource-list">
                <div className="scrollable-content">
                  <InstanceTable instances={this.state.instances} project={this.props.project} onResourceSelected={this.onResourceSelected}/>
                  <VolumeTable volumes={this.state.volumes} project={this.props.project} onResourceSelected={this.onResourceSelected}/>
                </div>
                <PreviewPanel resource={this.state.selectedResource}/>
              </div>
            </div>
          );
        }else{
          return (
             <div className="loading"></div>
          );
        }
      }

    });

  });
