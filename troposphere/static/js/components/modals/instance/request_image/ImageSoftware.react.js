/** @jsx React.DOM */

define(
  [
    'react',
    'stores'
  ],
  function (React, stores) {

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

        var label = "List Installed Software";
        var description = "List any software that you have installed. If the paths to the executables are different " +
                          "from /usr/bin or /usr/local/bin, list those also.";
        var name = "software";

        return (
          <div className="form-group" style={styles}>
            <label htmlFor={name} className="control-label">{label}</label>
            <div className="help-block">{description}</div>
            <textarea name={name} rows="4" className="form-control" placeholder="Installed software..." onChange={this.handleChange}/>
          </div>
        );
      }

    });

  });
