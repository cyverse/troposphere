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
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div className="image-versions">
            <h2>Versions of this Image</h2>
            <MachineList machines={this.props.application.get('machines')}
                         identities={this.props.identities}
            />
          </div>
        );
      }

    });

  });
