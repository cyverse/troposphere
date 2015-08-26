define(function (require) {

    var React = require('react'),
        Backbone = require('backbone'),
        _ = require('underscore'),
        stores = require('stores');

    var ENTER_KEY = 13;

    return React.createClass({
      displayName: "InstanceLaunchWizardModal-LicensingStep",

      propTypes: {
            licensingAccepted: React.PropTypes.bool.isRequired,
            licenses: React.PropTypes.array.isRequired,
            onPrevious: React.PropTypes.func.isRequired,
            onNext: React.PropTypes.func.isRequired
        },
      getDefaultProps: function() {
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
            return (<a href={license_text} target="_blank">{"See Link (In a new window) for license details."} </a>);
          } else {
            return (<textarea rows="7" className="form-control" readOnly value={license_text} />);
          }
        },
        renderLicense: function (license) {
            var license_type = license.type,
                license_text = license.text,
                license_title = license.title,
                license_div = (
                    <div className="row" key={license.id}>
                      <h4 className="col-sm-2">{license_title}</h4>
                      <div className="col-sm-10"> {this.renderLicenseText(license_type, license_text)} </div>
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
                    <div className="callout-info checkbox">
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
