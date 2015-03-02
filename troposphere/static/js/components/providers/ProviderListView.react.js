define(function(require){
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      Name = require('./Name.react'),
      Stats = require('./Stats.react'),
      Description = require('./Description.react'),
      Instances = require('./Instances.react'),
      Resources = require('./Resources.react');

  return React.createClass({

    mixins: [Router.State],


    render: function () {
      // we are fetching the provider here (and not in getInitialState) because the component
      // doesn't get re-mounted when the url changes, so those functions won't run twice
      var provider = stores.ProviderStore.get(this.getParams().providerId);

      if(!provider) return <div className="loading"></div>;

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

});