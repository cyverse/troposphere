define(function (require) {

  var React = require('react/addons');

  return React.createClass({
    displayName: "SystemFiles",

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      styles: React.PropTypes.object.isRequired
    },

    handleChange: function (e) {
      this.props.onChange(e.target.value)
    },

    render: function () {
      var styles = this.props.styles,
        label = "iPlant-managed System Files",
        name = "sys";

      var description = (
        <div>
          If your VM image requires a change in an Jetstream-managed system file (see
          <a href="http://jetstream-cloud.org/training.php" target="_blank">{"Important notes before you request an image"}</a>
          ), let us know the change and why the change is necessary.
        </div>
      );

      return (
        <div className="form-group" style={styles}>
          <label htmlFor={name} className="control-label">{label}</label>

          <div className="help-block">{description}</div>
          <textarea name={name} rows="4" className="form-control" placeholder="System file changes (if applicable)..."
                    onChange={this.handleChange}/>
        </div>
      );
    }

  });

});
