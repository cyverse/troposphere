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

    function getState() {
      return {
        feedback: null
      };
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function(){
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
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
        this.props.onConfirm();
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onFeedbackChange: function(e){
        var newFeedback = e.target.value;
        this.setState({feedback: newFeedback});
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
          var stateIsValid = this.state.feedback;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        var resourceNames = this.props.resources.map(function(resource){
          return (
            <li key={resource.id}>{resource.get('name')}</li>
          );
        });

        var content = (
          <form role='form'>

            <div className='form-group'>
              <p>
                {"Are you experiencing a problem with your project or its resources? Let us know!"}
              </p>
              <label htmlFor='volumeSize'>Additional information</label>
              <p>
                {"Information about your project and any selected resources will be sent with your comments."}
              </p>
              <ul>
                <li><strong>{"Project: "}</strong>{this.props.project.get('name')}</li>
                {resourceNames}
              </ul>


              <textarea type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.feedback}
                        onChange={this.onFeedbackChange}
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
