define(function (require) {

  var React = require('react');

  return React.createClass({
    displayName: "VersionChangeLog",

    propTypes: {
      value: React.PropTypes.string.isRequired,
      onChange: React.PropTypes.func.isRequired
    },

    handleChange: function(e){
      this.props.onChange(e.target.value)
    },

    render: function () {
      var label = "*Change Log",
          description = (
            "Concisely describe what you've changed in this specific version. "
            + "This description will help users understand how your application has changed over time."
          ),
          name = "version-changes";

      return (
        <div className="form-group">
          <label htmlFor={name} className="control-label">{label}</label>
          <div className="help-block">{description}</div>
          <textarea
            name={name}
            rows="4"
            className="form-control"
            value={this.props.value}
            placeholder="(e.g: v1.0 - Added 'New Feature' to Ubuntu 14.04)..."
            onChange={this.handleChange}
          />
        </div>
      );
    }

  });

});
