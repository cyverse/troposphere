
define(function (require) {
    var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ProjectSelect = require('../instance_launch/ProjectSelect.react'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');

    return React.createClass({
      displayName: "ProjectAddImageModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      },

      getInitialState: function() {
          //Note: This should be available already. But we have a 'fallback' in render()
          projects = stores.ProjectStore.getAll();
          if(projects) {
              projectId = projects.models[0].id;
          } else {
              projectId = 0;
          }
          return {
            projectId: projectId,
            projects: projects,
          }
      },

      isSubmittable: function () {
        var hasProject = !!this.state.projectId;
        return hasProject;
      },

      //
      // Mounting & State
      // ----------------
      //

      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function () {
        this.hide();
      },

      confirm: function () {
        this.hide();
        var project = this.state.projects.get(this.state.projectId);
        //Action to add 'image' to 'project' happens in 'props.onConfirm'
        this.props.onConfirm(project, this.props.image);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onProjectChange: function (e) {
        var newProjectId = parseInt(e.target.value); //Remove parseInt when we use UUIDs here.
        this.setState({projectId: newProjectId});
      },


      //
      // Render
      // ------
      //

      renderImage: function () {
        return (
          <p> {this.props.image.get('name')} </p>
        );
      },
      renderProjects: function () {
          if(this.state.projects == null) {
              projects = stores.ProjectStore.getAll();
              return (<div className='loading' />);
          }
          if(this.state.projectId == 0) {
              this.state.projectId = this.state.projects.models[0].id;
          }
          return (
             <div className='form-group'>
               <label htmlFor='project'>Project</label>
               <ProjectSelect
                 projectId={this.state.projectId}
                 projects={this.state.projects}
                 onChange={this.onProjectChange}
                 />
             </div>
          );
      },
      renderBody: function () {
         return (
           <div role='form'>

             <div className='form-group'>
               <label htmlFor='addImage'>Add Image to Project</label>

               <p>Select a project to add the image:</p>
               <ul>
                 {this.renderImage()}
               </ul>
             </div>
             {this.renderProjects()}


           </div>
         );
      },

      render: function () {
        // todo: If the user only has one project, provide an action to create another project

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Add Image to Project</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Add image to project
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
