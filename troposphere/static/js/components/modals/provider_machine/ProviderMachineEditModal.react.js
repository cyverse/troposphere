/** @jsx React.DOM */

define(
  [
    'react',
    'stores',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/image_request/ImageVisibility.react',
    'components/applications/detail/availability/AvailabilityView.react',
    'components/applications/detail/description/EditDescriptionView.react',
    'components/modals/provider_machine/Application.react'
  ],
  function (React, stores, BootstrapModalMixin, Visibility, AvailabilityView, EditDescriptionView, Application) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function () {
        return this.getState();
      },
      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },
      getState: function() {
        var machine = this.props.machine,
          current_app = this.props.application,
          applications = stores.ApplicationStore.getAll(),
          providers = stores.ProviderStore.getAll(),
          all_users = stores.UserStore.getAll(),
          //licenses = stores.LicenseStore.getAll(), //Future
          selectedApplication;

        var state = this.state || {
          image: null,
          all_users: null, //Future
          machineApplicationID: null, //Future
          machineLicenses: null,//Future
          machineMemberships: null, //Future
          machineDescription: null, // Future
          machineVersion: "",
          machineEndDate: "",
          machineUncopyable: "",
          visibility: "public", //Future
        };

        if (machine) {
            end_date = machine.get('end_date');
            state.machineVersion = machine.get('version');
            state.machineDescription = state.machineVersion.description;
            state.machineEndDate = isNaN(end_date) ? "" : end_date;
            state.machineUncopyable = ! state.machineVersion.allow_imaging;
        }

        //if (licenses) {
        //    state.machineLicenses = licenses;
        //}

        if (state.machineApplicationID === null) {
            state.machineApplicationID = current_app.id
        }
        if (applications) {
            selectedApplication = applications.get(state.machineApplicationID);
            // Since providers requires authentication, we can't display which providers
            // the image is available on on the public page
            state.image = selectedApplication;
            state.visibility = selectedApplication.get('private') ? "select" : "public";
        }
        if(providers) {
            state.providers = providers;
        }
        if(all_users) {
            state.all_users = all_users;
            state.machineMemberships = stores.UserStore.getUsersFromList(state.machineVersion.membership);
        }
        return state;
      },

      componentDidMount: function () {
        stores.ApplicationStore.addChangeListener(this.updateState);
        stores.UserStore.addChangeListener(this.updateState);
        //stores.LicenseStore.addChangeListener(this.updateState);
        //stores.MachineMembershipStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
        stores.UserStore.removeChangeListener(this.updateState);

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
        var uncopyable = (e.target.value === 'on') ? true : false;
        this.setState({machineUncopyable: uncopyable});
      },

      handleVisibilityChange: function(visibility){
        this.setState({visibility: visibility});
      },
      onApplicationSelected: function (selection) {
        this.setState({machineApplicationID: selection});
      },

      //TODO: Handle 'many to many' Licenses & Memberships : List current, Add New, Remove Existing
      //
      //
      // Render
      // ------
      //
      handleDescriptionChange: function(e){
        var description = e.target.value;
        this.setState({description: description});
      },
      renderBody: function() {
        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='machine-version'>Version Created On</label>
              <input type='text' className='form-control' value={this.state.machineVersion.start_date} onChange={this.onVersionChange}/>
            </div>

            <div className='form-group'>
              <label htmlFor='machine-end-date'>Version Removed On</label>
              <input type='text' className='form-control' value={this.state.machineEndDate} onChange={this.onEndDateChange}/>
            </div>
            <EditDescriptionView
              application={this.props.application}
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
            <AvailabilityView
              application={this.props.application}
              machine={this.props.machine}
              providers={this.state.providers}
            />
            <Visibility
                value={this.state.visibility}
                all_users={this.state.all_users}
                membership_list={this.state.machineMemberships}
                onChange={this.handleVisibilityChange}
             />
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
      renderMember: function(member) {
          return (<li> {member} </li>);
      },
      renderAddMember: function() {
          return (<li> "Add New Membership" </li>);
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
