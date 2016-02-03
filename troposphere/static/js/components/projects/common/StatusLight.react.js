
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

        var status = this.props.status || "";
        return (
          <span className={"instance-status-light " + status}></span>
        );
      }

    });

  });
