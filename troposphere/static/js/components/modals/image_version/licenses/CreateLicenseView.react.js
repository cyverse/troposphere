import React from 'react';
import EditDescriptionView from 'components/images/detail/description/EditDescriptionView.react';


export default React.createClass({
    displayName: "CreateLicenseView",

    propTypes: {
      onCreateLicense: React.PropTypes.func.isRequired,
      licenseTitle: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      return {
        licenseTitle: this.props.licenseTitle || "",
        licenseType: "URL",
        licenseURL: "",
        licenseText: "",
      }
    },
    isSubmittable: function () {
      if (!this.state.licenseTitle) {
        return false;
      } else if (this.state.licenseType == "URL") {
        if( this.state.licenseURL.search("https?://") < 0) {
          return false
        }
        //NOTE: Implicit 'full-text' type test
      } else if (this.state.licenseText.length < 4) {
        return false;
      }
      //Tests passed
      return true;
    },
    onCreateLicense: function(e) {
      var params = {
        title: this.state.licenseTitle,
        type: this.state.licenseType,
        text: (this.state.licenseType == "URL") ? this.state.licenseURL : this.state.licenseText
      };
      this.props.onCreateLicense(params);
    },
    onLicenseInputTypeChange: function (e) {
      var license_type = e.target.value;
      if (license_type == "URL") {
        this.setState({licenseType: license_type});
      } else {
        this.setState({licenseType: "Full Text"});
      }
    },
    onLicenseURLChange: function (e) {
      var url_text = e.target.value;
      this.setState({licenseURL: url_text})
    },
    onLicenseTextChange: function (e) {
      var full_text = e.target.value;
      this.setState({licenseText: full_text})
    },
    onLicenseTitleChange: function (e) {
      var title = e.target.value;
      this.setState({licenseTitle: title})
    },
    renderLicenseSelection: function () {
      if (this.state.licenseType == "URL") {
        return (
          <div className='form-group'>
            <label htmlFor='version-version'>License URL</label>
            <input type='text' className='form-control'
                   value={this.state.licenseURL} onChange={this.onLicenseURLChange}/>
          </div>
        );
      } else {
        //"Full Text"
        return (<EditDescriptionView
          title={"Full Text"}
          value={this.state.licenseText}
          onChange={this.onLicenseTextChange}
          />)
      }
    },
    renderLicenseInputRadio: function () {
      var urlRadio, fullTextRadio;

      //NOTE: There must be a better way ..? -Steve
      if (this.state.licenseType == "URL") {
        urlRadio = (
          <label className="radio-inline">
            <input checked="checked"
                   type="radio" name="inlineLicenseOptions"
                   id="licenseTypeURL" value="URL"
                   onChange={this.onLicenseInputTypeChange}/>
            URL
          </label>);
        fullTextRadio = (
          <label className="radio-inline">
            <input type="radio" name="inlineLicenseOptions"
                   id="licenseTypeText" value="Full Text"
                   onChange={this.onLicenseInputTypeChange}/>
            Full Text
          </label>);
      } else {
        urlRadio = (
          <label className="radio-inline">
            <input type="radio" name="inlineLicenseOptions"
                   id="licenseTypeURL" value="URL"
                   onChange={this.onLicenseInputTypeChange}/>
            URL
          </label>);
        fullTextRadio = (
          <label className="radio-inline">
            <input checked="checked"
                   type="radio" name="inlineLicenseOptions"
                   id="LicenseTypeText" value="Full Text"
                   onChange={this.onLicenseInputTypeChange}/>
            Full Text
          </label>);
      }

      return (
          <div>
            <label htmlFor="licenseTypeSelect">Input Type</label>
            <div className="form-group">
              {urlRadio}
              {fullTextRadio}
            </div>
          </div>
      );
    },
    renderLicenseTitle: function () {
      return (
        <div className="form-group">
          <label htmlFor="licenseTitle">License Title</label>
          <input type="text" className="form-control" id="licenseTitle"
                 placeholder="Title" value={this.state.licenseTitle}
                 onChange={this.onLicenseTitleChange}/>
        </div>
      );
    },
    render: function () {
      return (
        <div className="new-license-form new-item-form CreateLicenseView">
          <div className="license-input-type-container">
            {this.renderLicenseTitle()}
            {this.renderLicenseInputRadio()}
            {this.renderLicenseSelection()}
          </div>
          <div className="new-item-form-header form-group clearfix" style={{"border": "black 1px"}}>
            <button disabled={!this.isSubmittable()} onClick={this.onCreateLicense} type="button"
                    className="btn btn-primary btn-sm pull-right"
                    style={{marginTop:"20px"}}>
                    {"Create and Add"}
            </button>
          </div>
        </div>
      );
    }
});
