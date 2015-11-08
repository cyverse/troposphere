import React from 'react/addons';
import Router from 'react-router';
import stores from 'stores';
import Name from './Name.react';
import Stats from './Stats.react';
import Description from './Description.react';
import Instances from './Instances.react';
import Resources from './Resources.react';

export default React.createClass({
    displayName: "ProviderListView",

    mixins: [Router.State],


    render: function () {
      // we are fetching the provider here (and not in getInitialState) because the component
      // doesn't get re-mounted when the url changes, so those functions won't run twice
      var provider_id = Number(this.getParams().providerId);
      if (!provider_id) {
          var provider_list = stores.ProviderStore.getAll();
          if (provider_list !== null && provider_list.length > 0) {
              provider_id = provider_list.first().id;
          } else {
              provider_id = -1;
          }
      }
      var provider = stores.ProviderStore.get(provider_id);

      if (!provider) return <div className="loading"></div>;

      return (
        <div className="col-md-10 provider-details">
          <Name provider={provider}/>
          <Stats provider={provider}/>
          <Description provider={provider}/>
          <Instances provider={provider}/>
          <Resources provider={provider}/>
        </div>
      );

    }
});
