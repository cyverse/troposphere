import React from 'react';

export default React.createClass({
    displayName: "VersionName",

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      value: React.PropTypes.string.isRequired,
      create: React.PropTypes.bool,
      update: React.PropTypes.bool
    },
    getDefaultProps: function() {
      return {
        create: true,
        update: false,
      };
    },
    handleChange: function(e){
      this.props.onChange(e.target.value)
    },

    renderNameLabel: function() {
      if (this.props.create) {
        return "*New Version Name"
      } else if(this.props.update) {
        return "Edit Version Name"
      } else {
        //Create=False, Update=False
        return "*New Version Name"
      }
    },

    render: function () {
      return (
        <div className="form-group">
          <label htmlFor="name" className="control-label">{this.renderNameLabel()}</label>
          <div className="help-block">
            Versioning helps users understand how your changes relate to the overall progress of the Application.
            Versions are alphanumeric (e.g. 2.0-stable, 2.1-beta, 2.2-testing).
            Please limit name to 30 characters and keep versioning consistent.
          </div>
          <input
            type="text"
            name="name"
            className="form-control"
            maxLength="30"
            size="15"
            placeholder={this.props.init_value || "Name..."}
            value={this.props.value}
            onChange={this.handleChange}
          />
        </div>
      );
    }
});
