define(function (require) {

  var React = require('react'),
      stores = require('stores'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      Visibility = require('components/common/image_request/ImageVisibility.react'),
      AvailabilityView = require('components/images/detail/availability/AvailabilityView.react'),
      EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react'),
      MembershipView = require('./MembershipView.react'),
      Image = require('components/modals/image_version/Image.react');

  return React.createClass({
    mixins: [BootstrapModalMixin],

    propTypes: {
      version: React.PropTypes.object.isRequired,
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    getInitialState: function () {
      var version = this.props.version;

      return {
        versionName: version.get('name'),
        versionChangeLog: version.get('change_log'),
        versionEndDate: isNull(version.get('end_date')) ? "" : version.get('end_date'),
        versionCanImage: version.get('allow_imaging'),
        versionParentID: version.get('parent').id,
        versionLicenses: null,
        versionMemberships: null,
      }
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    getState: function() {
      return this.state;
    },

    componentDidMount: function () {
      stores.ImageStore.addChangeListener(this.updateState);
      stores.UserStore.addChangeListener(this.updateState);
      stores.ImageVersionStore.addChangeListener(this.updateState);
      //stores.VersionMembershipStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ImageStore.removeChangeListener(this.updateState);
      stores.UserStore.removeChangeListener(this.updateState);
      stores.ImageVersionStore.removeChangeListener(this.updateState);
      //stores.VersionMembershipStore.removeChangeListener(this.updateState);
    },

    //TODO: Pull this out to commons
    valid_date: function (date_stamp) {
      if (date_stamp === "") return true;
      var the_date = Date.parse(date_stamp);
      return !isNaN(the_date);
    },

    isSubmittable: function(){
      var hasVersionName   = !!this.state.versionName;
      var hasChangeLog = !!this.state.versionChangeLog;
      var validEndDate = !!this.valid_date(this.state.versionEndDate);
      return hasVersionName && hasChangeLog && validEndDate;
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
        this.state.versionName,
        this.state.versionChangeLog,
        this.state.versionEndDate,
        this.state.versionCanImage,
        this.state.versionImageID,
        this.state.versionLicenses,
        this.state.versionMemberships
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
      this.setState({versionName: e.target.value});
    },

    onEndDateChange: function (e) {
      this.setState({versionEndDate: e.target.value});
    },

    onUncopyableSelected: function (e) {
      var uncopyable = (e.target.value === 'on');
      this.setState({versionCanImage: uncopyable});
    },

    handleVisibilityChange: function(visibility){
      this.setState({visibility: visibility});
    },

    onImageSelected: function (selection) {
      this.setState({versionImageID: selection});
    },

    //TODO: Handle 'many to many' Licenses & Memberships : List current, Add New, Remove Existing
    //
    //
    // Render
    // ------
    //
    handleDescriptionChange: function(e){
      var description = e.target.value;
      this.setState({versionDescription: description});
    },

    renderBody: function() {
      if(!this.state.versionName) {
          return (<div className="loading"/>);
      }
      return (
        <div role='form'>

          <div className='form-group'>
            <label htmlFor='version-version'>Version Created On</label>
            <input type='text' className='form-control' value={this.state.versionName.get('start_date').format("MMMM Do, YYYY")} editable={false}/>
          </div>

          <div className='form-group'>
            <label htmlFor='version-end-date'>Version Removed On</label>
            <input type='text' className='form-control' value={this.state.versionEndDate} onChange={this.onEndDateChange}/>
          </div>
        {
        //For some reason, This is throwing a 'prop value not specified in <<anonymous>>' warning..
        }
          <EditDescriptionView
            image={this.props.image}
            value={this.state.versionDescription}
            onChange={this.handleDescriptionChange}
          />
          <AvailabilityView
            image={this.props.image}
            version={this.props.version}
            providers={this.state.providers}
          />
           <Visibility
           value={this.state.visibility}
           all_users={this.state.all_users}
           membership_list={this.state.versionMemberships}
           onChange={this.handleVisibilityChange}
           />
          <div className='form-group'>
            <label htmlFor='version-uncopyable'>Uncopyable</label>
            <input type='checkbox' className='form-control' checked={this.state.versionCanImage} onChange={this.onUncopyableSelected}/>
          </div>

          <Image
            imageId={this.state.versionImageID}
            onChange={this.onImageSelected}
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
      var images = stores.ImageStore.getAll(),
        providers = stores.ProviderStore.getAll(),
        all_users = stores.UserStore.getAll();
        //licenses = stores.LicenseStore.getAll(); //Future


      var version = this.props.version,
        end_date = version.get('end_date'),
        versionId = version.id;

      if (!end_date) {
      end_date =""
      }

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
