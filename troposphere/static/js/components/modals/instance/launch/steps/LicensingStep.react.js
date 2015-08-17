define(function (require) {

    var React = require('react'),
        Backbone = require('backbone'),
        _ = require('underscore'),
        stores = require('stores');

    var ENTER_KEY = 13;

    return React.createClass({
      displayName: "LicensingStep",

      propTypes: {
            licensingAccepted: React.PropTypes.bool.isRequired,
            licenses: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
            onPrevious: React.PropTypes.func.isRequired,
            onNext: React.PropTypes.func.isRequired
        },
        getDefaultPropTypes: function() {
          return {
            licensingAccepted: false,
          };
        },
      onLicenseChange: function(e){
        this.setState({licensingAccepted: e.target.checked});
      },
        getInitialState: function () {
          return {
            licensingAccepted: this.props.licensingAccepted
          };
        },
        isSubmittable: function () {
            return this.state.licensingAccepted;
        },

        confirm: function () {
            this.props.onNext(this.state);
        },
        renderLicenseText: function(license_type, license_text) {
          if(license_type == "URL") {
            <a href="{license_text}">{"See Link for license details."} </a>
          } else {
            <textarea rows="5" cols="80" readOnly>{license_text}</textarea>
          }
        },
        renderLicense: function (license) {
            var license_type = license.get('type'),
                license_text = license.get('text'),
                license_title = license.get('title'),
                license_div = (
                    <div className="form-group">
                      <strong>{license_title}</strong>
                      {this.renderLicenseText(license_type, license_text)}
                    </div>
                );

            return license_div;
        },
        renderBody: function () {
            var licenseDivs = this.props.licenses.map(this.renderLicense);

            return (
                <div role='form'>


                    <div className="modal-section form-horizontal">
                        <h4>Instance License Agreement</h4>

                      {licenseDivs}
                    </div>
                  <div className="form-group">
                    <div className="checkbox">
                      <label className="checkbox">
                        <input type="checkbox" onChange={this.onLicenseChange}/>
                        I agree to abide by the license(s) found on this Virtual Machine,
                        as outlined above.
                      </label>
                    </div>
                  </div>

                </div>
            );
        },
        render: function () {

            return (
                <div>
                {this.renderBody()}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default pull-left" onClick={this.props.onPrevious}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                            Next
                        </button>
                    </div>

                </div>
            );
        }
    });
});
