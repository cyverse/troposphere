define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      stores = require('stores'),
      Name = require('./request_image/ImageName.react'),
      Description = require('./request_image/ImageDescription.react'),
      Tags = require('./request_image/ImageTags.react'),
      Provider = require('./request_image/ImageProvider.react'),
      Visibility = require('components/core/request_image/ImageVisibility.react'),
      Software = require('./request_image/ImageSoftware.react'),
      SystemFiles = require('./request_image/ImageSystemFiles.react'),
      FilesToExclude = require('./request_image/ImageFilesToExclude.react'),
      LicenseAgreement = require('./request_image/ImageLicenseAgreement.react');

  return React.createClass({
    mixins: [BootstrapModalMixin],

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    canUpdate: function(instance, version) {
      var user = instance.get('user'),
          image = instance.get('image');
      if(user.id === image.user) {
          return true;
          //The instance owner is the owner of that image.
      } else if(user.is_staff || user.is_superuser) {
          //The instance owner is really important
          return true;
      } else {
          //Noone else can update the image.
          return false;
      }
    },
    canImage: function(instance, version) {
      var user = instance.get('user'),
          image = instance.get('image');
      if(user.id === image.user) {
          return true;
          //The instance owner is the owner of that image.
      } else if(user.is_staff || user.is_superuser) {
          //The instance owner is really important
          return true;
      } else {
          //Default to whether the version has explicitly enabled/disabled.
          return version.allow_imaging;
      }
    },
      getInitialState: function () {
        return this.getState();
      },
      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },
    getState: function () {
      var instance = this.props.instance,
          version = instance.get('version'),
          image = instance.get('image'),
          can_image = false,
          can_update = false,
          hasSelectedUpdate = false,
          instance_tags = null;

      var state = this.state || {
        allow_imaging: can_image,
        allow_update: can_update,
        name: "",
        description: "",
        tags: instance_tags,
        providerId: instance.get('provider').id,
        visibility: "public",
        membership_list: null,
        software: "",
        systemFiles: "",
        filesToExclude: "",
        hasAgreedToLicense: false,
        hasSelectedUpdate: false,
              checkCreate: true,
              checkUpdate: false,
        showAdvancedOptions: false
      };
      if(instance && version) {
          state.allow_imaging = this.canImage(instance, version),
          state.allow_update = this.canUpdate(instance, version),
          state.tags = stores.InstanceTagStore.getTagsFor(instance);
          state.membership_list = version.membership;
      }

      //Based on update_selected value
      if(state.checkUpdate) {
          state.name = image.name;
          state.description = version.description;
          //state.systemFiles = version.system_files;
          //state.software = version.software_files;
          //state.filesToExclude = version.excluded_files;
          state.visibility = image.private ? "select" : "public";
      }



      return state;
    },

    isSubmittable: function(){
      var hasName            = !!this.state.name;
      var hasDescription     = !!this.state.description;
      var hasProviderTarget  = !!this.state.providerId;
      var hasVisibility      = !!this.state.visibility;
      var hasAgreedToLicense = !!this.state.hasAgreedToLicense;

      return hasName && hasDescription && hasProviderTarget && hasVisibility && hasAgreedToLicense;
    },

    //
    // Mounting
    //

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    toggleAdvancedOptions: function(){
      this.setState({showAdvancedOptions: !this.state.showAdvancedOptions})
    },

    cancel: function(){
      this.hide();
    },

    confirm: function () {
      this.hide();

      var details = {
        name: this.state.name,
        description: this.state.description,
        tags: this.state.tags,
        providerId: this.state.providerId,
        visibility: this.state.visibility,
        software: this.state.software,
        systemFiles: this.state.systemFiles,
        filesToExclude: this.state.filesToExclude,
        hasAgreedToLicense: this.state.hasAgreedToLicense,
      };

      this.props.onConfirm(details);
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    handleNameChange: function(name){
      this.setState({name: name});
    },

    handleDescriptionChange: function(description){
      this.setState({description: description});
    },

    onCreateSelected: function(e) {
      this.setState({checkUpdate: false,
        checkCreate: true})
    },
    onUpdateSelected: function(e) {
      this.setState({checkUpdate: true,
      checkCreate: false})
    },

    onTagAdded: function(tag){
      var tags = this.state.tags;
      tags.add(tag);
      this.setState({tags: tags});
    },

    onTagRemoved: function(tag){
      var tags = this.state.tags;
      tags.remove(tag);
      this.setState({tags: tags});
    },

    handleProviderChange: function(providerId){
      this.setState({providerId: Number(providerId)});
    },

    handleVisibilityChange: function(visibility){
      this.setState({visibility: visibility});
    },

    handleSoftwareChange: function(software){
      this.setState({software: software});
    },

    handleSystemFilesChange: function(systemFiles){
      this.setState({systemFiles: systemFiles});
    },

    handleFilesToExcludeChange: function(filesToExclude){
      this.setState({filesToExclude: filesToExclude});
    },

    handleLicenseAgreementChange: function(hasAgreedToLicense){
      this.setState({hasAgreedToLicense: hasAgreedToLicense});
    },

    //
    // Render
    // ------
    //

    renderAdvancedOptions: function(){
      var toggleOpenStyles = {
        fontSize: "14px",
        borderBottom: "1px solid #ccc",
        fontWeight: "bold"
      };

      var toggleClosedStyles = {
        fontSize: "14px",
        fontWeight: "bold"
      };

      var optionStyles = {
        paddingLeft: "20px"
      };

      if(this.state.showAdvancedOptions){
        return (
          <div>
            <h4 onClick={this.toggleAdvancedOptions} style={toggleOpenStyles}>
              - Hide advanced options
            </h4>
            <Software styles={optionStyles} onChange={this.handleSoftwareChange}/>
            <SystemFiles styles={optionStyles} onChange={this.handleSystemFilesChange}/>
            <FilesToExclude styles={optionStyles} onChange={this.handleFilesToExcludeChange}/>
          </div>
        )
      }else{
        return (
          <div>
            <h4 onClick={this.toggleAdvancedOptions} style={toggleClosedStyles}>
              + Show advanced options
            </h4>
          </div>
        )
      }
    },

    renderBody: function(){
      return (
        <div>
          <div className="alert alert-danger">
            <strong>Note:</strong> All volumes must be detached from an instance before it can be imaged.
          </div>

          <p className="alert alert-info">
            {"Please read the "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/oIZy" target="_blank">
                wiki page about requesting an image of your instance
            </a>
            {" before completing the form below."}
          </p>
          <div className="form-group">
            <label htmlFor='imaging-fork'>Create or Update</label>
          <input type="radio" onClick={this.onCreateSelected} className="form-control" name="create_switch" value="create" disabled={!this.state.allow_imaging} checked={this.state.check_create}>Create</input>
          <input type="radio" onClick={this.onUpdateSelected} className="form-control" name="update_switch" value="update" disabled={!this.state.allow_imaging && !this.state.allow_update} checked={this.state.check_update}>Update</input>
          </div>
          <Name create={this.state.checkCreate} onChange={this.handleNameChange}/>
          <Description onChange={this.handleDescriptionChange}/>
          <Tags
            instance={this.state.instance}
            imageTags={this.state.tags}
            onTagAdded={this.onTagAdded}
            onTagRemoved={this.onTagRemoved}
          />
          <Provider
            providerId={this.state.providerId}
            onChange={this.handleProviderChange}
          />
          <Visibility
            value={this.state.visibility}
            membership_list={this.state.membership_list}
            onChange={this.handleVisibilityChange}
          />
          {this.renderAdvancedOptions()}
          <hr/>
          <LicenseAgreement onChange={this.handleLicenseAgreementChange}/>
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
                <strong>Image Request</strong>
              </div>
              <div className="modal-body">
                {this.renderBody()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={this.cancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                  Request Imaging
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

  });

});
