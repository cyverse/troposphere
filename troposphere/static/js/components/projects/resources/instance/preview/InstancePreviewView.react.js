define(function (require) {
  'use strict';

  var React = require('react/addons'),
    stores = require('stores'),
    Id = require('../details/sections/details/Id.react'),
    Status = require('../details/sections/details/Status.react'),
    Size = require('../details/sections/details/Size.react'),
    IpAddress = require('../details/sections/details/IpAddress.react'),
    LaunchDate = require('../details/sections/details/LaunchDate.react'),
    CreatedFrom = require('../details/sections/details/CreatedFrom.react'),
    Identity = require('../details/sections/details/Identity.react');

  return React.createClass({

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

});
