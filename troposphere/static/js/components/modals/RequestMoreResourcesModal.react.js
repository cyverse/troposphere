
define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores'
  ],
  function (React, BootstrapModalMixin, stores) {

    return React.createClass({
      displayName: "RequestMoreResourcesModal",

      mixins: [BootstrapModalMixin],

      getInitialState: function () {
        var identities = stores.IdentityStore.getAll();
        return {
          identity: identities ? identities.first().id : null,
          resources: "",
          reason: "",
          instance: "",
          selectedCPU: 1
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

      handleInstanceChange: function(e){
        this.setState({instance: e.target.value});
      },

      handleCPUChange: function(e){
        this.setState({selectedCPU: e.target.value});
      },

      //
      // Render
      // ------
      //
      
      renderDefaultAUCalculator: function(){
        var remainingAU = this.state.identity ? stores.IdentityStore.get(this.state.identity).get('usage').remaining : stores.IdentityStore.getAll().first().get('usage').remaining;
        return(
          <div>
            <div className='form-group'>
              <a role="button" data-toggle="collapse" href="#au-calculator" aria-expanded="true">
                AU Calculator
              </a>
            </div>

            <div id="au-calculator" className="collapse">
                <strong>You have {remainingAU} AU remaining this month.</strong>

                <div>
                Calculate AU needed to run a
                <select value={this.state.selectedCPU} className='form-control' onChange={this.handleCPUChange}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                </select>
                CPU instance for...
              </div>

              <table className="table">
                <tbody>
                  <th>
                    Duration
                  </th>
                  <th>
                    AU needed 
                  </th>
                  <tr><td>1 day</td><td>{(this.state.selectedCPU * 24 * 1)}</td></tr>
                  <tr><td>3 days</td><td>{(this.state.selectedCPU * 24 * 3)}</td></tr>
                  <tr><td>1 week</td><td>{(this.state.selectedCPU* 24 * 7)}</td></tr>
                  <tr><td>2 weeks</td><td>{(this.state.selectedCPU * 24 * 14)}</td></tr>
                </tbody>
              </table>

             <strong>Note: We can not approve requests greater than 2,304 AU.</strong>
            </div>
          </div>
        );
      },

      renderAUCalculator: function(){
        if(stores.InstanceStore.getAll().length < 1){
          return this.renderDefaultAUCalculator();
        }

        var remainingAU = this.state.identity ? stores.IdentityStore.get(this.state.identity).get('usage').remaining : stores.IdentityStore.getAll().first().get('usage').remaining;

        var options = stores.InstanceStore.getAll().map(function(instance){
          return (
            <option value={instance.id}>{instance.get('name')}</option>
          );
        });

        var selectedInstance = this.state.instance ? stores.InstanceStore.get(this.state.instance): stores.InstanceStore.getAll().first();

        return(
          <div>
            <div className='form-group'>
              <a role="button" data-toggle="collapse" href="#au-calculator" aria-expanded="true">
                AU Calculator
              </a>
            </div>
            <div id="au-calculator" className="collapse">
                <strong>You have {remainingAU} AU remaining this month.</strong>
                <div>
                Calculate AU needed to continue running
                <select value={this.state.instance ? this.state.instance : options[0]} className='form-control' onChange={this.handleInstanceChange}>
                  {options}
                </select>
                for...
              </div>

              <table className="table">
                <tbody>
                  <th>
                    Duration
                  </th>
                  <th>
                    AU needed 
                  </th>
                  <tr><td>1 day</td><td>{(selectedInstance.get('size').cpu * 24 * 1)}</td></tr>
                  <tr><td>3 days</td><td>{(selectedInstance.get('size').cpu * 24 * 3)}</td></tr>
                  <tr><td>1 week</td><td>{(selectedInstance.get('size').cpu * 24 * 7)}</td></tr>
                  <tr><td>2 weeks</td><td>{(selectedInstance.get('size').cpu * 24 * 14)}</td></tr>
                </tbody>
              </table>
             <strong>Note: We can not approve requests greater than 2,304 AU.</strong>
            </div>
          </div>
        );
      },

      renderIdentity: function (identity) {
        return (
          <option value={identity.id}>{identity.get('provider').name}</option>
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
                        placeholder="E.g 4 CPUs and 8GB memory, running 4 cores for 1 week, an additional 5400 cpu hours, etc."
                        value={this.state.resources}
                        onChange={this.handleResourcesChange}
                />
            </div>

            {this.renderAUCalculator()}

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
