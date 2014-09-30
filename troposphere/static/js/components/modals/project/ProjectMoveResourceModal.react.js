/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores/ProjectStore',
    '../instance_launch/ProjectSelect.react'
  ],
  function (React, Backbone, BootstrapModalMixin, ProjectStore, ProjectSelect) {

    // Example Usage from http://bl.ocks.org/insin/raw/8449696/
    // render: function(){
    // <div>
    //   ...custom components...
    //   <ExampleModal
    //      ref="modal"
    //      show={false}
    //      header="Example Modal"
    //      buttons={buttons}
    //      handleShow={this.handleLog.bind(this, 'Modal about to show', 'info')}
    //      handleShown={this.handleLog.bind(this, 'Modal showing', 'success')}
    //      handleHide={this.handleLog.bind(this, 'Modal about to hide', 'warning')}
    //      handleHidden={this.handleLog.bind(this, 'Modal hidden', 'danger')}
    //    >
    //      <p>I'm the content.</p>
    //      <p>That's about it, really.</p>
    //    </ExampleModal>
    // </div>
    //

    // To show the modal, call this.refs.modal.show() from the parent component:
    // handleShowModal: function() {
    //   this.refs.modal.show();
    // }

    function getState(currentProject, currentState) {
      var state = {
        projects: ProjectStore.getAll(),
        projectId: null
      };

      // Use selected project or default to the null one
      if(state.projects) {
        state.projects = state.projects.clone();
        state.projects.remove(currentProject);

        // todo: Account for the scenario when the only project is the current one
        // and the length of projects will now be zero
        state.projectId = currentState.projectId || state.projects.first().id;
      }

      return state;
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        currentProject: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function(){
        return getState(this.props.currentProject, this.state || {});
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState(this.props.currentProject, this.state || {}));
      },

      componentDidMount: function () {
        ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProjectStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        var project = this.state.projects.get(this.state.projectId);
        this.props.onConfirm(project);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onProjectChange: function(e){
        var newProjectId = e.target.value;
        this.setState({projectId: newProjectId});
      },


      //
      // Render
      // ------
      //

      render: function () {
        // todo: If the user only has one project, provide an action to create another project

        var buttonArray = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
        ];

        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if the user hasn't provided a name, size or identity for the volume
          var stateIsValid = true;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        var content;
        if(this.state.projects){
          var resourceNames = this.props.resources.map(function(resource){
            return (
              <li key={resource.id}>{resource.get('name')}</li>
            );
          });

          content = (
            <form role='form'>

              <div className='form-group'>
                <label htmlFor='volumeSize'>Resources to Move</label>
                <p>The following resources will be moved to the selected project</p>
                <ul>
                  {resourceNames}
                </ul>
              </div>

              <div className='form-group'>
                <label htmlFor='project'>Project</label>
                <ProjectSelect
                    projectId={this.state.projectId}
                    projects={this.state.projects}
                    onChange={this.onProjectChange}
                />
              </div>

            </form>
          );
        }else{
          content = (
            <div className="loading"></div>
          );
        }

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>{this.props.header}</strong>
                </div>
                <div className="modal-body">
                  {content}
                </div>
                <div className="modal-footer">
                  {buttons}
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
