/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var volume = this.props.volume;
        var volumeProvider = this.props.providers.get(volume.get('identity').provider);

        return (
          <span>{volumeProvider.get('name')}</span>
        );
      }

    });

  });
