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
        this.props.onChange(e.target.checked)
      },

      render: function () {
        return (
          <div className="form-group" style={{marginBottom: "-20px"}}>
            <div className="checkbox">
              <label className="checkbox">
                <input type="checkbox" id="licensed_software" onChange={this.handleChange}/>
                <strong>
                  I certify that this image does not contain license-restricted software that is prohibited from being
                  distributed within a virtual or cloud environment.
                </strong>
              </label>
              <br />
            </div>
          </div>
        );
      }

    });

  });
