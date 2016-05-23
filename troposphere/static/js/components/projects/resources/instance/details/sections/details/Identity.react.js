import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import stores from 'stores';


export default React.createClass({
    displayName: "Identity",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        var instance = this.props.instance,
          provider = stores.ProviderStore.get(instance.get('provider').id);

        if (!provider) return <div className="loading-tiny-inline"></div>;

        return (
          <ResourceDetail label="Provider">
            {provider.get('name')}
          </ResourceDetail>
        );
    }

});
