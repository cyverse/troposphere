/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, BootstrapModalMixin) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      getInitialState: function () {
        return {
          projectName: "",
          projectDescription: ""
        };
      },

      isSubmittable: function(){
        var hasName        = !!this.state.projectName;
        var hasDescription = !!this.state.projectDescription;
        return hasName && hasDescription;
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
        this.props.onConfirm(this.state.projectName, this.state.projectDescription);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      // todo: I don't think there's a reason to update state unless
      // there's a risk of the component being re-rendered by the parent.
      // Should probably verify this behavior, but for now, we play it safe.
      onNameChange: function (e) {
        this.setState({projectName: e.target.value});
      },

      onDescriptionChange: function (e) {
        this.setState({projectDescription: e.target.value});
      },

      //
      // Render
      // ------
      //

      renderBody: function(){
        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='project-name'>Project Name</label>
              <input type='text' className='form-control' value={this.state.projectName} onChange={this.onNameChange}/>
            </div>

            <div className='form-group'>
              <label htmlFor='project-description'>Description</label>
              <textarea type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.projectDescription}
                        onChange={this.onDescriptionChange}
              />
            </div>
          </div>
        );
      },

      render: function () {

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Create Project</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
