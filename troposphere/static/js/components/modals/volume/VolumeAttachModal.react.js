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

    return React.createClass({
      displayName: "VolumeAttachModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        helpLink: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      isSubmittable: function () {
        var hasInstanceId = !!this.state.instanceId;
        return hasInstanceId;
      },

      //
      // Mounting & State
      // ----------------
      //

      getState: function() {
        if (this.props.project === undefined)
            throw new Error("Volume attach modal lacks a project");

        var project = this.props.project;

        // TODO: remove ambiguity between state/this.state
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
          state.instances = state.instances.filter(function (i) {
            return i.get('identity').provider === volume.get('identity').provider;
          });
          state.instances = new InstanceCollection(state.instances);
          state.instanceId = this.state.instanceId || state.instances.first().id;
        }

        return state;
      },

      getInitialState: function () {
        return this.getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.ProjectInstanceStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.ProjectInstanceStore.removeChangeListener(this.updateState);
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
        var instance = this.state.instances.get(this.state.instanceId);
        if (instance === undefined) throw new Error("Instance not found in modal's instances store");
        this.props.onConfirm(instance);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onInstanceChange: function (e) {
        var newInstanceId = ~~e.target.value;
        this.setState({instanceId: newInstanceId});
      },

      //
      // Render
      // ------
      //

      renderLoadingContent: function () {
        return (
          <div className="modal-content">
            <div className="modal-header">
              {this.renderCloseButton()}
              <strong>Attach Volume</strong>
            </div>
            <div className="modal-body">
              <div className="loading"></div>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        )
      },

      renderAttachRulesContent: function () {
        return (
          <div className="modal-content">
            <div className="modal-header">
              <strong>Volume Attach Rules</strong>
            </div>
            <div className="modal-body">
              <div role='form'>
                <div className='form-group'>
                  <p>
                    <strong>Uh oh! </strong>
                    It looks like you don't have any instances in this project
                    that you can attach the volume to. Volumes can only be
                    attached to instances that are <strong>active</strong>, in
                    the <strong>same project</strong> and on the <strong>same
                    provider</strong> as the volume.
                  </p>

                  <p>
                    {
                      "If you'd like to attach this volume to an instance, you'll first need to "
                    }
                    <a href={this.props.helpLink.get('href')}>create an instance</a>
                    {
                      " on the same provider or move an existing instance into this project."
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.cancel}>
                OK
              </button>
            </div>
          </div>
        )
      },

      renderAttachVolumeContent: function (instances) {
        var instanceId = this.state.instanceId;

        return (
          <div className="modal-content">
            <div className="modal-header">
              {this.renderCloseButton()}
              <strong>Attach Volume</strong>
            </div>
            <div className="modal-body">
              <div role='form'>
                <p>Select the instance from the list below that you would like to attach the volume to:</p>

                <div className='form-group'>
                  <label htmlFor='instance'>Instance</label>
                  <InstanceSelect
                    instanceId={instanceId}
                    instances={instances}
                    onChange={this.onInstanceChange}
                    />
                </div>
              </div>
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
        )
      },

      render: function () {
        var project = this.props.project,
            instances = this.state.instances,
            content;

        var activeInstances = instances && instances.filter(i => i.is_active());

        if (instances == null) {
          content = this.renderLoadingContent();
        } else if (activeInstances.length > 0) {
          content = this.renderAttachVolumeContent(activeInstances);
        } else {
          content = this.renderAttachRulesContent();
        }

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              {content}
            </div>
          </div>
        );
      }

    });

});
