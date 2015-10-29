import React from 'react/addons';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import stores from 'stores';

export default React.createClass({
    displayName: "Identity",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume,
        provider = stores.ProviderStore.get(volume.get('provider'));

      if (!provider) return <div className="loading"></div>;

      return (
        <ResourceDetail label="Provider">
          {provider.get('name')}
        </ResourceDetail>
      );
    }

});
