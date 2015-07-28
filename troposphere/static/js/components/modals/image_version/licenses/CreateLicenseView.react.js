define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react');

  var ENTER_KEY = 13;

  return React.createClass({
    display: "CreateLicenseView",

    getInitialState: function(){
      return {
        licenseTitle: "",
        licenseType: "URL",
        licenseURL: "",
        licenseText: "",
      }
    },

    onLicenseInputTypeChange: function(e) {
      var license_type = e.target.value;
      if(license_type == "URL") {
          this.setState({licenseType: license_type});
      } else {
          this.setState({licenseType: "full_text"});
      }
    },
    onLicenseURLChange: function(e) {
        var url_text = e.target.value;
        this.setState({licenseURL: url_text})
    },
    onLicenseTextChange: function(e) {
      var full_text = e.target.value;
      this.setState({licenseText: full_text})
    },
    onLicenseTitleChange: function(e) {
      var title = e.target.value;
      this.setState({licenseTitle: title})
    },
    renderLicenseSelection: function() {
        if(this.state.licenseType == "URL") {
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
            image={this.props.image}
            value={this.state.licenseText}
            onChange={this.onLicenseTextChange}
            />)
        }
    },
    renderLicenseInputRadio: function() {
        var urlRadio, fullTextRadio;

        //NOTE: There must be a better way ..? -Steve
        if(this.state.licenseType == "URL") {
            urlRadio = (
                <label className="radio-inline">
                    <input checked="checked" type="radio" name="inlineRadioOptions" id="licenseTypeURL" value="URL" onChange={this.onLicenseInputTypeChange} />
                    URL
                </label>);
            fullTextRadio = (
                <label className="radio-inline">
                    <input type="radio" name="inlineRadioOptions" id="LicenseTypeText" value="full_text"  onChange={this.onLicenseInputTypeChange} />
                    Full Text
                </label>);
        } else {
            urlRadio = (
                    <label className="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="licenseTypeURL" value="URL" onChange={this.onLicenseInputTypeChange} />
                        URL
                    </label>);
            fullTextRadio = (
                    <label className="radio-inline">
                        <input checked="checked" type="radio" name="inlineRadioOptions" id="LicenseTypeText" value="full_text"  onChange={this.onLicenseInputTypeChange} />
                        Full Text
                    </label>);
        }

      return (
          <div className="form-group">
            <label for="licenseTypeSelect">Input Type</label>
              {urlRadio}
              {fullTextRadio}
            </div>
            );
    },
    renderLicenseTitle: function() {
      return (<div class="form-group">
          <label for="licenseTitle">License Title</label>
          <input type="text" class="form-control" id="licenseTitle" placeholder="Title" value={this.state.licenseTitle} onChange={this.onLicenseTitleChange}/>
        </div>
      );
    },
    render: function() {
      return (
        <div className="license-input-type-container">
          {this.renderLicenseTitle()}
          {this.renderLicenseInputRadio()}
          {this.renderLicenseSelection()}
        </div>
      );
    }
  });

});
