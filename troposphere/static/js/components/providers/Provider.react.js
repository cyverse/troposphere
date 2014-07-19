/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div className="provider">
            <h2>{this.props.provider.get('location')}</h2>
            <p>{this.props.provider.get('description')}</p>
          </div>
        );
      }
    });

  });
