/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var providerNames = this.props.application.get('machines').map(function(machine){
            var provider = this.props.providers.get(machine.get('provider'));
            return provider.get('location');
        }.bind(this));

        return (
          <div className='image-availability'>
            <h2>Image available on:</h2>
            <span>{providerNames.join(", ")}</span>
          </div>
        );
      }

    });

  });
