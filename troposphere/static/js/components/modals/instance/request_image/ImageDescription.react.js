/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      propTypes: {
        onChange: React.PropTypes.func.isRequired
      },

      handleChange: function(e){
        this.props.onChange(e.target.value)
      },

      render: function () {
        var label = "Description of the Image";
        var description = "Concisely describe the tools installed and their purpose. Please include key words that will " +
                          "help users search for this image and decide whether it will suit their needs.";
        var name = "description";

        return (
          <div className="form-group">
            <label htmlFor={name} className="control-label">{label}</label>
            <div className="help-block">{description}</div>
            <textarea name={name} rows="4" className="form-control"  placeholder="Description..." onChange={this.handleChange}/>
          </div>
        );
      }

    });

  });
