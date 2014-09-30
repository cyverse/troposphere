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
      onProjectNameChange: function (e) {
        this.setState({projectName: e.target.value});
      },

      onProjectDescriptionChange: function (e) {
        this.setState({projectDescription: e.target.value});
      },

      //
      // Render
      // ------
      //

      render: function () {
        var buttonArray = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
        ];

        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if the user hasn't provided a name, size or identity for the volume
          var stateIsValid = this.state.projectName &&
                             this.state.projectDescription;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        var content = (
          <form role='form'>
            <div className='form-group'>
              <label htmlFor='project-name'>Project Name</label>
              <input type='text' className='form-control' value={this.state.projectName} onChange={this.onProjectNameChange}/>
            </div>
            <div className='form-group'>
              <label htmlFor='project-description'>Description</label>
              <textarea type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.projectDescription}
                        onChange={this.onProjectDescriptionChange}
              />
            </div>
          </form>
        );

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
