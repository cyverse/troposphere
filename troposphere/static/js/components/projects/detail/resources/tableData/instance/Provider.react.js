import React from 'react/addons';
import Backbone from 'backbone';
import stores from 'stores';

export default React.createClass({
    displayName: "Provider",

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
