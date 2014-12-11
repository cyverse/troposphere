/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores'
  ],
  function (React, Backbone, stores) {

    return React.createClass({

      propTypes: {
        maintenanceMessages: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderMessage: function(message){
        var provider = stores.ProviderStore.get(message.get('provider_id'));
        var providerName = provider.get('name');
        return (
          <li key={message.id} className="message">
            <strong>{providerName} </strong>
            {message.get('message')}
          </li>
        )
      },

      render: function () {
        return (
          <ul className="message-banner">
            {this.props.maintenanceMessages.map(this.renderMessage)}
          </ul>
        );
      }

    });

  });
