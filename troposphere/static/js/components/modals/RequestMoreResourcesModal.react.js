
define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/AUCalculator.react',
    'stores'
  ],
  function (React, BootstrapModalMixin, AUCalculator, stores) {

    return React.createClass({
      displayName: "RequestMoreResourcesModal",

      mixins: [BootstrapModalMixin],

      getInitialState: function () {
        var identities = stores.IdentityStore.getAll();
        return {
          identity: identities ? identities.first().id : null,
          resources: "",
          reason: ""
        };
      },

      getState: function () {
        var identities = stores.IdentityStore.getAll(),
          identityId = null;

        if (identities) {
          identityId = this.state.identity ? this.state.identity : identities.first().id;
        }

        return {
          identity: identityId
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.IdentityStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.IdentityStore.removeChangeListener(this.updateState);
      },

      isSubmittable: function () {
        var hasIdentity = !!this.state.identity;
        var hasResources = !!this.state.resources;
        var hasReason = !!this.state.reason;
        return hasResources && hasReason;
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
        this.props.onConfirm(this.state.identity, this.state.resources, this.state.reason);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      // todo: I don't think there's a reason to update state unless
      // there's a risk of the component being re-rendered by the parent.
      // Should probably verify this behavior, but for now, we play it safe.
      handleIdentityChange: function (e) {
        this.setState({identity: Number(e.target.value)});
      },

      handleResourcesChange: function (e) {
        this.setState({resources: e.target.value});
      },

      handleReasonChange: function (e) {
        this.setState({reason: e.target.value});
      },

      //
      // Render
      // ------
      //

      renderIdentity: function (identity) {
        return (
          <option key={identity.id} value={identity.id}>{identity.get('provider').name}</option>
        )
      },

      renderBody: function () {
        var identities = stores.IdentityStore.getAll(),
            instances = stores.InstanceStore.getAll();

        if (!identities || !instances) return <div className="loading"/>;

        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='project-identity'>{"What cloud would you like resources for?"}</label>
              <select className="form-group" onChange={this.handleIdentityChange}>
                {identities.map(this.renderIdentity)}
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='project-name'>{"What resources would you like to request?"}</label>
              <textarea type='text'
                        className='form-control'
                        rows="7"
                        placeholder="E.g 4 CPUs and 8GB memory, running 4 cores for 1 week, an additional 500 AU, etc."
                        value={this.state.resources}
                        onChange={this.handleResourcesChange}
                />
            </div>

            <AUCalculator identity={this.state.identity}/>

            <div className='form-group'>
              <label htmlFor='project-description'>{"How will you use the additional resources?"}</label>
              <textarea type='text'
                        className='form-control'
                        rows="7"
                        placeholder="E.g. To run a program or analysis, store larger output, etc."
                        value={this.state.reason}
                        onChange={this.handleReasonChange}
                />
            </div>
            <strong>Note: Allocation allowances are set back to a default of 168 AU on the first of every month.</strong>
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
                  <strong>Request Resources</strong>
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
                    Request Resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
