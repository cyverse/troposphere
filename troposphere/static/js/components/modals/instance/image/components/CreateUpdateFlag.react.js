define(function (require) {

  var React = require('react');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      value: React.PropTypes.string.isRequired,
    },

    handleChange: function(e){
      this.props.onChange(e.target.checked)
    },

    renderNameLabel: function() {
     return "Create or Update"
    },
    renderHelpText: function() {
      return "            'Create' will create a brand new image."
      +" 'Update' will create a new version for the same image.";
    },
    render: function () {
      return (
        <div className="form-group">
          <label htmlFor="update" className="control-label">{this.renderNameLabel()}</label>
          <div className="help-block">{this.renderHelpText()}</div>
          <input
            type="checkbox"
            name="update"
            className="form-control"
            checked={this.props.value}
            onChange={this.handleChange}
            />
        </div>

      );
    }

  });

});
