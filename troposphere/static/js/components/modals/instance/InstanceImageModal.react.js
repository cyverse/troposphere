/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react',
    'stores',

    './request_image/ImageName.react',
    './request_image/ImageDescription.react',
    './request_image/ImageTags.react',
    './request_image/ImageProvider.react',
    './request_image/ImageVisibility.react',
    './request_image/ImageSoftware.react',
    './request_image/ImageSystemFiles.react',
    './request_image/ImageFilesToExclude.react',
    './request_image/ImageLicenseAgreement.react'
  ],
  function (React, Backbone, BootstrapModalMixin, Glyphicon, stores, Name, Description, Tags, Provider, Visibility, Software, SystemFiles, FilesToExclude, LicenseAgreement) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function () {
        return {
          name: "",
          description: "",
          providerId: null,
          visibility: null,
          hasAgreedToLicense: false,
          showAdvancedOptions: false
        };
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

      componentDidMount: function () {
        var el = this.getDOMNode();
        var $el = $(el);
        $el.find('select[name="tags"]').chosen();
      },

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
        var reportInfo = this.getReportInfo();
        this.props.onConfirm(reportInfo);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //


      //
      // Render
      // ------
      //

      renderId: function(instance){
        return (
          <div className="form-group">
            <label htmlFor="instance" className="control-label">{"Instance ID"}</label>
            <div className="controls">{"0bbbc916-0c76-4006-a86c-e570c96ff819"}</div>
            <input type="hidden" name={"instanceId"} value={"0bbbc916-0c76-4006-a86c-e570c96ff819"} />
          </div>
        );
      },

      renderIpAddress: function(instance){
        return (
          <div className="form-group">
            <label htmlFor="instance" className="control-label">{"IP Address"}</label>
            <div className="controls">{"128.196.64.25"}</div>
            <input type="hidden" name={"ipAddress"} value={"128.196.64.25"} />
          </div>
        );
      },

      renderName: function(){
        return (
          <div className="form-group">
            <label htmlFor="name" className="control-label">Image Name</label>
            <div className="help-block">
              Something meaningful to help users find this image. Please limit name to 30 characters.
            </div>
            <input type="text" name="name" className="form-control" maxLength="30" size="15" placeholder="Name..."/>
          </div>
        );
      },

      renderDescription: function(){
        var label = "Description of the Image";
        var description = "Concisely describe the tools installed and their purpose. Please include key words that will " +
                          "help users search for this image and decide whether it will suit their needs.";
        var name = "description";

        return (
          <div className="form-group">
            <label htmlFor={name} className="control-label">{label}</label>
            <div className="help-block">{description}</div>
            <textarea name={name} rows="4" className="form-control"  placeholder="Description..."/>
          </div>
        );
      },

      renderProvider: function(provider){
        return (
          <option value={provider.id}>{provider.get('location')}</option>
        )
      },

      renderProviders: function(){
        var providers = stores.ProviderStore.getAll();

        var options = providers.map(this.renderProvider);

        return (
          <div className="form-group">
            <label htmlFor="provider" className="control-label">Cloud for Deployment</label>
            <div className="help-block">
              Select the cloud provider on which you plan to use this image.
            </div>
            <select name="provider" className="form-control">
              {options}
            </select>
          </div>
        );
      },

      renderSoftware: function(styles){
        var label = "List Installed Software";
        var description = "List any software that you have installed. If the paths to the executables are different " +
                          "from /usr/bin or /usr/local/bin, list those also.";
        var name = "software";

        return (
          <div className="form-group" style={styles}>
            <label htmlFor={name} className="control-label">{label}</label>
            <div className="help-block">{description}</div>
            <textarea name={name} rows="4" className="form-control" placeholder="Installed software..."/>
          </div>
        );
      },

      renderSystemFiles: function(styles){
        var label = "iPlant-managed System Files";
        var description = (
          <div>
            If your VM image requires a change in an iPlant-managed system file (see
              <a href="https://pods.iplantcollaborative.org/wiki/x/oIZy" target="_blank">{" Important Notes #4"}</a>
            ), let us know the change and why the change is necessary.
          </div>
        );
        var name = "sys";

        return (
          <div className="form-group" style={styles}>
            <label htmlFor={name} className="control-label">{label}</label>
            <div className="help-block">{description}</div>
            <textarea name={name} rows="4" className="form-control" placeholder="System file changes (if applicable)..."/>
          </div>
        );
      },

      renderFilesToExclude: function(styles){
        var label = "Files to exclude";
        var description = "If your instance has files you'd like to exclude from the image, list them here. Write one path per line.";
        var name = "exclude";

        return (
          <div className="form-group" style={styles}>
            <label htmlFor={name} className="control-label">{label}</label>
            <div className="help-block">{description}</div>
            <textarea name={name} rows="4" className="form-control" placeholder="Files to exclude (if applicable)..."/>
          </div>
        );
      },

      renderTags: function(){
        var tags = this.props.tags.map(function(tag){
          var tagName = tag.get('name');
          return (
            <option key={tag.id} value={tagName}>{tagName}</option>
          );
        });

        return (
          <div className="form-group">
            <label htmlFor="tags" className="control-label">Image Tags</label>
            <div className="tagger_container">
              <div className="help-block">
                Please include tags that will help users decide whether this image will suit their
                needs. You can include the operating system, installed software, or configuration information. E.g. Ubuntu,
                NGS Viewers, MAKER, QIIME, etc.
              </div>
              <select name="tags" data-placeholder="Select tags to add..." multiple className="form-control">
                {tags}
              </select>
              <input type="hidden" name="tags" className="tag_input" />
            </div>
          </div>
        );
      },

      renderVisibility: function(){
        return (
          <div className="form-group">
            <label htmlFor="vis" className="control-label">Image Visibility</label>
            <div className="help-block" id="vis_help">
              A VM image can be made visible to you, a select group of users or to
              everyone. If you want visibility restricted to a select group of users, provide us a list of iPlant
              usernames. Public visibility means that any user will be able to launch the instance.
            </div>
            <select name="visibility" className="form-control">
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="select">Specific Users</option>
            </select>
          </div>
        );
      },

      renderLicenseAgreement: function(){
        return (
          <div className="form-group" style={{marginBottom: "-20px"}}>
            <div className="checkbox">
              <label className="checkbox">
                <input type="checkbox" id="licensed_software" />
                <strong>
                  I certify that this image does not contain license-restricted software that is prohibited from being
                  distributed within a virtual or cloud environment.
                </strong>
              </label>
              <br />
            </div>
          </div>
        );
      },

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
              <Software styles={optionStyles}/>
              <SystemFiles styles={optionStyles}/>
              <FilesToExclude styles={optionStyles}/>
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
        var instance = this.props.instance;

        return (
          <div>
            <div className="alert alert-danger">
              <strong>Note:</strong> All volumes must be detached from an instance before it can be imaged.
            </div>

            <p className="alert alert-info">
              {"Please read the "}
              <a href="https://pods.iplantcollaborative.org/wiki/x/oIZy" target="_blank">wiki page about requesting an image of your instance</a>
              {" before completing the form below."}
            </p>

            <Name/>
            <Description/>
            <Tags instance={instance} tags={this.props.tags}/>
            <Provider/>
            <Visibility/>
            {this.renderAdvancedOptions()}
            <hr/>
            <LicenseAgreement/>
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
                  <strong>Report Instance</strong>
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
