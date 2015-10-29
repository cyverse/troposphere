import React from 'react/addons';
import stores from 'stores';
import Id from '../details/sections/details/Id.react';
import Status from '../details/sections/details/Status.react';
import Size from '../details/sections/details/Size.react';
import IpAddress from '../details/sections/details/IpAddress.react';
import LaunchDate from '../details/sections/details/LaunchDate.react';
import CreatedFrom from '../details/sections/details/CreatedFrom.react';
import Identity from '../details/sections/details/Identity.react';

export default React.createClass({
    displayName: "InstancePreviewView",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var instance = stores.InstanceStore.get(this.props.instance.id),
        provider = instance ? stores.ProviderStore.get(instance.get('provider').id) : null;

      if (!instance || !provider) return <div className="loading"></div>;

      return (
        <ul>
          <Id instance={instance}/>
          <Status instance={instance}/>
          <Size instance={instance}/>
          <IpAddress instance={instance}/>
          <LaunchDate instance={instance}/>
          <CreatedFrom instance={instance}/>
          <Identity instance={instance} provider={provider}/>
        </ul>
      );
    }

});
