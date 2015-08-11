define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var instance = this.props.instance,
        provider = stores.ProviderStore.get(instance.get('provider').id);

      if (!provider) return <div className="loading-tiny-inline"></div>;

      return (
        <span>{provider.get('name')}</span>
      );
    }

  });

});
