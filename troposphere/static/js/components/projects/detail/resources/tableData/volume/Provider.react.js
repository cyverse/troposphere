define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume,
          provider = stores.ProviderStore.get(volume.get('provider').id);

      if(!provider) return <div className="loading-tiny-inline"></div>;

      return (
        <span>{provider.get('name')}</span>
      );
    }

  });

});
