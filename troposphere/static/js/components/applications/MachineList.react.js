/** @jsx React.DOM */

define(
  [
    'react',
    './Machine.react'
  ],
  function (React, Machine) {

    return React.createClass({

      render: function () {
        var versions = this.props.machines.map(function (model) {
          return (
            <Machine key={model.id} machine={model}/>
          );
        });

        return (
          <ul>{versions}</ul>
        );
      }

    });

  });
