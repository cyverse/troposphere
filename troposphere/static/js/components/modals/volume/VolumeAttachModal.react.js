/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores/InstanceStore',
    '../volume_attach/InstanceSelect.react'
  ],
  function (React, BootstrapModalMixin, InstanceStore, InstanceSelect) {

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

    function getState(project) {
      var state = {
        instances: InstanceStore.getInstancesInProject(project),
        instanceId: null
      };

      this.state = this.state || {};

      // Use selected instance or default to the first one
      if (state.instances) {
        state.instanceId = this.state.instanceId || state.instances.first().id;
      }

      return state;
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        return getState.apply(this, [this.props.project]);
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState.apply(this, [this.props.project]));
      },

      componentDidMount: function () {
        InstanceStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
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
        var instance = this.state.instances.get(this.state.instanceId);
        this.props.onConfirm(instance);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onInstanceChange: function(e){
        var newInstanceId = e.target.value;
        this.setState({instanceId: newInstanceId});
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

          // Disable the launch button if the user hasn't provided a name for the instance
          var stateIsValid = this.state.instanceId;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        var content;
        if(this.state.instances){
          content = (
            <form role='form'>
              <p>Select the instance from the list below that you would like to attach the volume to:</p>

              <div className='form-group'>
                <label htmlFor='instance'>Instance</label>
                <InstanceSelect
                    instanceId={this.state.instanceId}
                    instances={this.state.instances}
                    onChange={this.onInstanceChange}
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
