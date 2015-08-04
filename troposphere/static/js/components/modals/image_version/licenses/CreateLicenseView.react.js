define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    actions = require('actions'),
    EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react');

  var ENTER_KEY = 13;

  return React.createClass({
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
        this.setState({licenseType: "full_text"});
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
        //"full_text"
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
                   id="licenseTypeText" value="full_text"
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
                   id="LicenseTypeText" value="full_text"
                   onChange={this.onLicenseInputTypeChange}/>
            Full Text
          </label>);
      }

      return (
        <div className="form-group">
          <label htmlFor="licenseTypeSelect">Input Type</label>
          {urlRadio}
          {fullTextRadio}
        </div>
      );
    },
    renderLicenseTitle: function () {
      return (<div className="form-group">
          <label htmlFor="licenseTitle">License Title</label>
          <input type="text" className="form-control" id="licenseTitle"
                 placeholder="Title" value={this.state.licenseTitle}
                 onChange={this.onLicenseTitleChange}/>
        </div>
      );
    },
    render: function () {
      return (

        <div className="new-license-form new-item-form">
          <div className="new-item-form-header" style={{"border": "black 1px"}}>
            <button disabled={!this.isSubmittable()} onClick={this.onCreateLicense} type="button"
                    className="btn btn-default btn-sm">{"Create and Add"}</button>
          </div>
          <div className="license-input-type-container">
            {this.renderLicenseTitle()}
            {this.renderLicenseInputRadio()}
            {this.renderLicenseSelection()}
          </div>
        </div>
      );
    }
  });

});
