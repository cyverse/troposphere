/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var summaries = this.props.volumes.map(function (volume) {
          return (
            <div key={volume.id}>{"1 " + volume.get('status')}</div>
          );
        }.bind(this));

        var title = this.props.volumes.length + " Volumes";

        return (
          <div className="resource-summary">
            <h2>{title}</h2>
            {summaries}
          </div>
        );
      }

    });

  });
