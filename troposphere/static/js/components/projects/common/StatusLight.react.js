
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      displayName: "StatusLight",

      propTypes: {
        status: React.PropTypes.string.isRequired
      },

      render: function () {
        var status = this.props.status;
        var className = "instance-status-light "; 

        if (status == "active") {
          className += "active";
        } else if (status == "transition") {
          className += "transition";
        } else if (status == "inactive") {
          className += "inactive";
        } else {
          className += "error";
        }

        return (
          <span className={ className }></span>
        );
      }

    });

  });
