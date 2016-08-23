import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';

export default React.createClass({
    displayName: "Provider",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume,
        provider = stores.ProviderStore.get(volume.get('provider').id);

      if (!provider) return <div className="loading-tiny-inline"></div>;

      return (
        <span>{provider.get('name')}</span>
      );
    }
});
