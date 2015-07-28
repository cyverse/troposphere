
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        resourceName: React.PropTypes.string.isRequired,
        used: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired
      },

      render: function () {
        // Example Output:
        //
        // You are using 12 of 32 allocated CPUs

        return (
          <div>
            {"You are using "}
            <b>{this.props.used + " of " + this.props.max}</b>
            {" allocated "}
            <b>{this.props.resourceName}</b>
          </div>
        );
      }

    });

  });
