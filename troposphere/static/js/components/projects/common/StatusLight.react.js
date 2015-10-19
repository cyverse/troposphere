
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
        var statusLight;

        if (status === "active") {
          statusLight = <span className="instance-status-light active"></span>;
        } else if (status === "transition") {
          statusLight = <span className="instance-status-light transition"></span>;
        } else if (status === "inactive") {
          statusLight = <span className="instance-status-light inactive"></span>;
        } else {
          statusLight = <span className="instance-status-light"></span>;
        }

        return (
          statusLight
        );
      }

    });

  });
