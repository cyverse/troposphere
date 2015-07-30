define(function (stores) {

  var React = require('react'),
    Backbone = require('backbone'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      maintenanceMessages: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    renderMessage: function (message) {
      var provider = stores.ProviderStore.get(message.get('provider')),
        providerName = provider ? provider.get('name') : "";

      return (
        <li key={message.id} className="message">
          <strong className="provider-name">{providerName}</strong>
          <span dangerouslySetInnerHTML={{__html: message.get('message')}}/>
        </li>
      );
    },

    render: function () {
      var maintenanceMessages = this.props.maintenanceMessages;

      return (
        <div className="message-banner-wrapper">
          <div className="container">
            <ul className="message-banner">
              {maintenanceMessages.map(this.renderMessage)}
            </ul>
          </div>
        </div>
      );
    }

  });

});
