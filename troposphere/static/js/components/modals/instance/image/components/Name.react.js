define(function (require) {

  var React = require('react');

  return React.createClass({
    displayName: "Name",

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      value: React.PropTypes.string.isRequired,
      create: React.PropTypes.bool.isRequired
    },

    handleChange: function(e){
      this.props.onChange(e.target.value)
    },

    renderNameLabel: function() {
      if (this.props.create) {
        return "*New Image Name"
      } else {
        return "*Edit Name of Existing Image"
      }
    },

    render: function () {
      return (
        <div className="form-group">
          <label htmlFor="name" className="control-label">{this.renderNameLabel()}</label>
          <div className="help-block">
            Something meaningful to help users find this image. Please limit name to 30 characters.
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

});
