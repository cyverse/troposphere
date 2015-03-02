define(function(require){
  "use strict";

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router'),
      stores = require('stores'),
      Name = require('./Name.react'),
      ProviderStats = require('./ProviderStats.react'),
      ProviderDescription = require('./ProviderDescription.react'),
      ProviderInstances = require('./ProviderInstances.react'),
      ProviderResourcesSection = require('./ProviderResourcesSection.react');

  return React.createClass({

    mixins: [Router.State],

    //
    // Mounting & State
    // ----------------
    //

    //getState: function() {
    //  return {
    //    provider:
    //  };
    //},
    //
    //getInitialState: function() {
    //  return this.getState();
    //},
    //
    //updateState: function() {
    //  if (this.isMounted()) this.setState(this.getState())
    //},
    //
    //componentDidMount: function () {
    //  stores.ProviderStore.addChangeListener(this.updateState);
    //},
    //
    //componentWillUnmount: function () {
    //  stores.ProviderStore.removeChangeListener(this.updateState);
    //},


    render: function () {
      // we are fetching the provider here (and not in getInitialState) because the component
      // doesn't get re-mounted when the url changes, so those functions won't run twice
      var provider = stores.ProviderStore.get(this.getParams().providerId),
          identities = this.props.identities,
          instances = this.props.instances,
          volumes = this.props.volumes,
          projects = this.props.projects;

      if(!provider) return <div className="loading"></div>;

      //return (
      //  <div className="col-md-10 provider-details">
      //    <Name provider={provider}/>
      //    <ProviderStats provider={provider}
      //                   identities={identities}
      //                   instances={instances}
      //    />
      //    <ProviderDescription provider={provider}/>
      //    <ProviderInstances provider={provider}
      //                       identities={identities}
      //                       instances={instances}
      //                       volumes={volumes}
      //                       projects={projects}
      //    />
      //    <ProviderResourcesSection provider={provider}
      //                              identities={identities}
      //                              instances={instances}
      //                              volumes={volumes}
      //                              projects={projects}
      //    />
      //  </div>
      //);

      return (
        <div className="col-md-10 provider-details">
          <Name provider={provider}/>
          <ProviderStats provider={provider}/>
        </div>
      );

    }

  });

});