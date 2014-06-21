/** @jsx React.DOM */

define(
  [
    'react',
    './Machine.react'
  ],
  function (React, Machine) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.array.isRequired
      },

      render: function () {
        var versions = this.props.machines.map(function (machine) {
          return (
            <Machine key={machine.id} machine={machine}/>
          );
        });

        return (
          <ul>{versions}</ul>
        );
      }

    });

  });
