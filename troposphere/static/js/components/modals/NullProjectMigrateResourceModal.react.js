/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'components/modals/migrate_resources/ProjectSelect.react',
    'components/modals/migrate_resources/ResourceListItem.react',
    'stores'
  ],
  function (React, Backbone, BootstrapModalMixin, ProjectSelect, ResourceListItem, stores) {

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

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        dateTimeStamp: React.PropTypes.string.isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function () {
        var initialState = {
          projectName: "", //this.props.dateTimeStamp,
          projects: stores.ProjectStore.getAll(),
          projectId: null
        };

        if(initialState.projects && initialState.projects.length > 0){
          initialState.projectId = initialState.projects.first().id;
        }else{
          initialState.projectId = "-1";
        }

        return initialState;
      },

      getState: function(){
        var state = {
          projectName: this.state.projectName,
          projects: stores.ProjectStore.getAll(),
          projectId: this.state.projectId
        };

        if(!state.projectId){
          if(state.projects && state.projects.length > 0){
            state.projectId = state.projects.first().id;
          }
        }

        return state;
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

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

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        if(this.state.projectName){
          this.props.onConfirm({
            projectName: this.state.projectName
          });
        }else{
          this.props.onConfirm({
            projectId: this.state.projectId,
            projects: this.state.projects
          });
        }

      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onProjectNameChange: function (e) {
        this.setState({projectName: e.target.value});
      },

      onProjectChange: function (e) {
        this.setState({projectId: e.target.value});
      },

      //
      // Render
      // ------
      //

      render: function () {
        var content;

        if(this.state.projects) {
          var buttonArray = [
            {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
          ];

          var buttons = buttonArray.map(function (button) {
            // Enable all buttons be default
            var isDisabled = false;

            // Disable the launch button if the user hasn't provided a name, size or identity for the volume
            var stateIsValid = !!this.state.projectName || (!!this.state.projectId && this.state.projectId !== "-1");
            if (button.type === "primary" && !stateIsValid) isDisabled = true;

            return (
              <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
                {button.text}
              </button>
              );
          }.bind(this));

          var resourceNames = this.props.resources.map(function (resource) {
            return (
              <ResourceListItem key={resource.id} resource={resource}/>
            );
          });

          var projectSelection, explanationText = "";
          if (this.state.projects.length > 0) {
            projectSelection = (
              <div className='form-group'>
                <ProjectSelect projectId={this.state.projectId}
                               projects={this.state.projects}
                               onChange={this.onProjectChange}
                />
              </div>
            );
            explanationText = "In order to interact with your resources (such as suspending instances or attaching " +
                              "volumes) you will need to move them into a project.  Please select the project you would " +
                              "like to move them into below. You may also create a new project."
          }else{
            explanationText = "In order to interact with your resources (such as suspending instances or attaching " +
                              "volumes) you will need to move them into a project. At the moment, you don't have any " +
                              "projects, but that's not a problem at all!  We can create your first one right here. " +
                              "Please enter a name for your project below."
          }

          var newProjectCreation;
          if(this.state.projectId === "-1"){
            newProjectCreation = (
              <div className='form-group'>
                <label>Project Name</label>
                <input type="text"
                       className="form-control"
                       value={this.state.projectName}
                       onChange={this.onProjectNameChange}
                       placeholder="Enter project name..."
                />
              </div>
            )
          }

          content = (
            <form role='form'>
              <div className='form-group'>
                <p>{"Looks like you have some resources that aren't in a project!"}</p>
                <ul>
                  {resourceNames}
                </ul>
                <p>{explanationText}</p>
              </div>
              {projectSelection}
              {newProjectCreation}
            </form>
            );
        }else {
          content = (
            <div className="loading"></div>
          );
        }

          return (
            <div className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
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
