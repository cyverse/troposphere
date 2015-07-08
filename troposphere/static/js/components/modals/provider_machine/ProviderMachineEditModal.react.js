define(function (require) {

  var React = require('react'),
      stores = require('stores'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      Visibility = require('components/common/image_request/ImageVisibility.react'),
      AvailabilityView = require('components/applications/detail/availability/AvailabilityView.react'),
      EditDescriptionView = require('components/applications/detail/description/EditDescriptionView.react'),
      Application = require('components/modals/provider_machine/Application.react');

  return React.createClass({
    mixins: [BootstrapModalMixin],

    propTypes: {
      machine: React.PropTypes.object.isRequired,
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
          selectedApplication,
          end_date;

      var state = this.state || {
        image: null,
        all_users: null, //Future
        machineApplicationID: null, //Future
        machineLicenses: null,//Future
        machineMemberships: null, //Future
        machineDescription: null, // Future
        applicationVersion: null,
        machineEndDate: "",
        machineUncopyable: "",
        visibility: "public" //Future
      };

      if (machine) {
        end_date = machine.end_date;
        var versionId = machine.version.id;
        var version = stores.ApplicationVersionStore.get(versionId);
        if(version) {
            state.applicationVersion = version;
        }
        state.machineEndDate = isNaN(end_date) ? "" : end_date;
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

      if (state.applicationVersion) {
          state.machineDescription = state.applicationVersion.get('description');
          state.machineUncopyable = !state.applicationVersion.get('allow_imaging');

          if (all_users) {
              state.all_users = all_users;
              var member_list = state.applicationVersion.get('membership'),
              memberships = member_list.map(function(username){return {"username":username};})
              state.machineMemberships = new Backbone.Collection(memberships);
          }
      }
      return state;
    },

    componentDidMount: function () {
      stores.ApplicationStore.addChangeListener(this.updateState);
      stores.UserStore.addChangeListener(this.updateState);
      stores.ApplicationVersionStore.addChangeListener(this.updateState);
      //stores.MachineMembershipStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ApplicationStore.removeChangeListener(this.updateState);
      stores.UserStore.removeChangeListener(this.updateState);
      stores.ApplicationVersionStore.removeChangeListener(this.updateState);
      //stores.MachineMembershipStore.removeChangeListener(this.updateState);
    },

    //TODO: Pull this out to commons
    valid_date: function (date_stamp) {
      if (date_stamp === "") return true;
      var the_date = Date.parse(date_stamp);
      return !isNaN(the_date);
    },

    isSubmittable: function(){
      var hasVersion   = !!this.state.applicationVersion;
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
        this.state.applicationVersion,
        this.state.machineEndDate,
        this.state.machineUncopyable,
        this.state.machineApplicationID,
        this.state.machineLicenses,
        this.state.machineMemberships
      );
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onVersionChange: function (e) {
      this.setState({applicationVersion: e.target.value});
    },

    onEndDateChange: function (e) {
      this.setState({machineEndDate: e.target.value});
    },

    onUncopyableSelected: function (e) {
      var uncopyable = (e.target.value === 'on');
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
      this.setState({machineDescription: description});
    },

    renderBody: function() {
      if(!this.state.applicationVersion) {
          return (<div className="loading"/>);
      }
      return (
        <div role='form'>

          <div className='form-group'>
            <label htmlFor='machine-version'>Version Created On</label>
            <input type='text' className='form-control' value={this.state.applicationVersion.get('start_date').format("MMMM Do, YYYY")} editable={false}/>
          </div>

          <div className='form-group'>
            <label htmlFor='machine-end-date'>Version Removed On</label>
            <input type='text' className='form-control' value={this.state.machineEndDate} onChange={this.onEndDateChange}/>
          </div>
        {
        //For some reason, This is throwing a 'prop value not specified in <<anonymous>>' warning..
        }
          <EditDescriptionView
            application={this.props.application}
            value={this.state.machineDescription}
            onChange={this.handleDescriptionChange}
          />
          <AvailabilityView
            application={this.props.application}
            machine={this.props.machine}
            providers={this.state.providers}
          />
          {
            /*
             <Visibility
             value={this.state.visibility}
             all_users={this.state.all_users}
             membership_list={this.state.machineMemberships}
             onChange={this.handleVisibilityChange}
             />
             */
          }
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
      return (<li>{member}</li>);
    },

    renderAddMember: function() {
      return (<li>"Add New Membership"</li>);
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
