import React from 'react/addons';

export default React.createClass({
    displayName: "CreateUpdateFlag",

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      value: React.PropTypes.bool.isRequired,
    },

    handleChange: function (e) {
      this.props.onChange(e.target.checked)
    },

    renderNameLabel: function() {
     return "Create or Update?"
    },
    renderHelpText: function() {
      return "Checking 'New Image' will create a brand new image."
      +" Or un-check to create a new version for the same image.";
    },
    render: function () {
      return (
        <div id="CreateUpdateFlag">
        <h4 htmlFor="update" className="control-label">{this.renderNameLabel()}</h4>
        <div className="form-group callout-info">
          <div className="help-block">{this.renderHelpText()}</div>
          <div className="form-group">
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  name="update"
                  checked={this.props.value}
                  onChange={this.handleChange}
                  />New Image?
              </label>
            </div>
          </div>
        </div>
        <hr />
        </div>
      );
    }
});
