/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    '../volume_attach/InstanceSelect.react'
  ],
  function (React, Backbone, BootstrapModalMixin, stores, InstanceSelect) {

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
        instances: stores.ProjectInstanceStore.getInstancesFor(project),
        instanceId: null
      };

      this.state = this.state || {};

      // Use selected instance or default to the first one
      if (state.instances) {
        var volume = this.props.volume,
            InstanceCollection = state.instances.constructor;

        // Filter out instances not in the same provider as the volume
        state.instances = state.instances.filter(function(i){
          return i.get('identity').provider === volume.get('identity').provider;
        });
        state.instances = new InstanceCollection(state.instances);


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

      isSubmittable: function(){
        var hasInstanceId = !!this.state.instanceId;
        return hasInstanceId;
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
        stores.InstanceStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.InstanceStore.removeChangeListener(this.updateState);
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

      renderBody: function(){

        if(this.state.instances){
          return (
            <div role='form'>
              <p>Select the instance from the list below that you would like to attach the volume to:</p>

              <div className='form-group'>
                <label htmlFor='instance'>Instance</label>
                <InstanceSelect
                    instanceId={this.state.instanceId}
                    instances={this.state.instances}
                    onChange={this.onInstanceChange}
                />
              </div>

            </div>
          );
        }

        return (
          <div className="loading"></div>
        );
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Attach Volume</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                    Attach volume to instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
