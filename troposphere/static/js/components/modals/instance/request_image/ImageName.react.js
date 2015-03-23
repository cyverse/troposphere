define(function (require) {

  var React = require('react');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired
    },

    handleChange: function(e){
      this.props.onChange(e.target.value)
    },

    render: function () {
      return (
        <div className="form-group">
          <label htmlFor="name" className="control-label">Image Name</label>
          <div className="help-block">
            Something meaningful to help users find this image. Please limit name to 30 characters.
          </div>
          <input
            type="text"
            name="name"
            className="form-control"
            maxLength="30"
            size="15"
            placeholder="Name..."
            onChange={this.handleChange}
          />
        </div>
      );
    }

  });

});
