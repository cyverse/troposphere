define(function (require) {

  var React = require('react');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      styles: React.PropTypes.object.isRequired,
      value: React.PropTypes.string
    },

    handleChange: function (e) {
      this.props.onChange(e.target.value)
    },

    render: function () {
      var styles = this.props.styles,
        value = this.props.value;

      return (
        <div className="form-group" style={styles}>
          <label htmlFor={name} className="control-label">
            Files to exclude
          </label>

          <div className="help-block">
            <p>
              {
                "The following directories will automatically be excluded from the image:"
              }
            </p>

            <div>/home/</div>
            <div>/mnt/</div>
            <div>/tmp/</div>
            <div>/root/</div>
          </div>
          <div className="help-block">
            {
              "If your instance has additional files or directories you'd like to " +
              "exclude, please list them here. Write one path per line."
            }
          </div>
          <textarea
            value={value}
            name={"exclude"}
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
