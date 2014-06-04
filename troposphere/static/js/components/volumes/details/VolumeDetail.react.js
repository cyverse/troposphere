/** @jsx React.DOM */

define(
  [
    'react',
    './VolumeDetailPage.react',
    'backbone'
  ],
  function (React, VolumeDetailPage, Backbone) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <VolumeDetailPage
            volume={this.props.volume}
            instances={this.props.instances}
            providers={this.props.providers}
          />
        );
      }

    });

  });
