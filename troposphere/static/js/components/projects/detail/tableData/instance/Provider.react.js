/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var provider = this.props.providers.get(this.props.instance.get('identity').provider);

        return (
          <span>{provider.get('name')}</span>
        );
      }

    });

  });
