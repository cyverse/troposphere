/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      propTypes: {
        onChange: React.PropTypes.func.isRequired,
        styles: React.PropTypes.object.isRequired
      },

      handleChange: function(e){
        this.props.onChange(e.target.value)
      },

      render: function () {
        var styles = this.props.styles;

        var label = "Files to exclude";
        var description = "If your instance has files you'd like to exclude from the image, list them here. Write one path per line.";
        var name = "exclude";

        return (
          <div className="form-group" style={styles}>
            <label htmlFor={name} className="control-label">{label}</label>
            <div className="help-block">{description}</div>
            <textarea name={name} rows="4" className="form-control" placeholder="Files to exclude (if applicable)..." onChange={this.handleChange}/>
          </div>
        );
      }

    });

  });
