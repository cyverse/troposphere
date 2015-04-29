/** @jsx React.DOM */

define(
  [
    'react',
    'stores',
    'components/mixins/BootstrapModalMixin.react',
    'components/modals/provider_machine/Application.react'
  ],
  function (React, stores, BootstrapModalMixin, Application) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function () {
        return this.getState();
      },
      getState: function() {
        var machine = this.props.machine,
          current_app = this.props.application,
          applications = stores.ApplicationStore.getAll(),
          //licenses = stores.LicenseStore.getAll(), //Future
          //memberships = stores.MachineMembershipStore.getAll(), //Future
          selectedApplication;

        var state = this.state || {
          machineApplicationID: null, //Future
          machineLicenses: null,//Future
          machineMemberships: null, //Future
          machineVersion: "",
          machineEndDate: "",
          machineUncopyable: "",
        };

        if (machine) {
            state.machineVersion = machine.get('version');
            state.machineEndDate = machine.get('end_date');
            state.machineUncopyable = ! machine.get('allow_imaging');
        }

        //if (licenses) {
        //    state.machineLicenses = licenses;
        //}

        //if (memberships) {
        //    state.machineMemberships = memberships;
        //}
        if (state.machineApplicationID === null) {
            state.machineApplicationID = current_app.id
        }

        if (applications) {
            selectedApplication = applications.get(state.machineApplicationID)
        }

        return state;
      },

      componentDidMount: function () {
        stores.ApplicationStore.addChangeListener(this.updateState);
        //stores.LicenseStore.addChangeListener(this.updateState);
        //stores.MachineMembershipStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
        //stores.LicenseStore.removeChangeListener(this.updateState);
        //stores.MachineMembershipStore.removeChangeListener(this.updateState);
      },

      //TODO: Pull this out to commons
      valid_date: function (date_stamp) {
        if (date_stamp === "") {
            return true;
        }
        the_date = Date.parse(date_stamp);
        if (isNaN(the_date) === true) {
            return false;
        } else {
            return true;
        }
      },
      isSubmittable: function(){
        var hasVersion        = !!this.state.machineVersion;
        var validEndDate = !!this.valid_date(this.state.machineEndDate);
        return hasVersion && validEndDate;
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
        this.props.onConfirm(
                this.state.machineVersion,
                this.state.machineEndDate,
                this.state.machineUncopyable,
                this.state.machineApplicationID,
                this.state.machineLicenses,
                this.state.machineMemberships);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      // todo: I don't think there's a reason to update state unless
      // there's a risk of the component being re-rendered by the parent.
      // Should probably verify this behavior, but for now, we play it safe.
      onVersionChange: function (e) {
        this.setState({machineVersion: e.target.value});
      },

      onEndDateChange: function (e) {
        this.setState({machineEndDate: e.target.value});
      },

      onUncopyableSelected: function (e) {
        boolean value = e.target.value === ? 'on' : false;
        this.setState({machineUncopyable: value});
      },

      onApplicationSelected: function (e) {
        this.setState({machineApplicationID: e.target.value});
      },

      //TODO: Handle 'many to many' Licenses & Memberships : List current, Add New, Remove Existing
      //
      //
      // Render
      // ------
      //

      renderBody: function(){
        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='machine-version'>Machine Version</label>
              <input type='text' className='form-control' value={this.state.machineVersion} onChange={this.onVersionChange}/>
            </div>

            <div className='form-group'>
              <label htmlFor='machine-end-date'>Removed</label>
              <input type='text' className='form-control' value={this.state.machineEndDate} onChange={this.onEndDateChange}/>
            </div>

            <div className='form-group'>
              <label htmlFor='machine-uncopyable'>Uncopyable</label>
              <input type='checkbox' className='form-control' checked={this.state.machineUncopyable} onChange={this.onUncopyableSelected}/>
            </div>

            <Application
              applicationId={this.state.machineApplicationID}
              onChange={this.onApplicationSelected}
            />
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
