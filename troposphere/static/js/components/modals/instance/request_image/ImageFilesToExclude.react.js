define(function (require) {

  var React = require('react');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      styles: React.PropTypes.object.isRequired
    },

    handleChange: function(e){
      this.props.onChange(e.target.value)
    },

    render: function () {
      var styles = this.props.styles,
          label = "Files to exclude",
          description = "If your instance has files you'd like to exclude from the image, list them here. Write one path per line.",
          name = "exclude";

      return (
        <div className="form-group" style={styles}>
          <label htmlFor={name} className="control-label">
            {label}
          </label>
          <div className="help-block">
            {description}
          </div>
          <textarea
            name={name}
            rows="4"
            className="form-control"
            placeholder="Files to exclude (if applicable)..."
            onChange={this.handleChange}
          />
        </div>
      );
    }

  });

});
