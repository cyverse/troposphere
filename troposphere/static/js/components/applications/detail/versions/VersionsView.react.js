/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './MachineList.react'
  ],
  function (React, Backbone, MachineList) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div className="image-versions">
            <h2>Versions of this Image</h2>
            <MachineList machines={this.props.application.get('machines')}/>
          </div>
        );
      }

    });

  });
