define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    RouterUtl = require('Router'),
    RouteHandler = Router.RouteHandler,
    stores = require('stores'),
    ProviderLinks = require('./ProviderLinks.react');
    
  return React.createClass({
    displayName: "ProvidersMaster",

    mixins: [Router.State],

    //
    // Mounting & State
    // ----------------
    //

    getState: function () {
      return {
        providers: stores.ProviderStore.getAll()
      };
    },

    getInitialState: function () {
      return this.getState();
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState())
    },

    componentWillMount: function () {
        var providers = stores.ProviderStore.getAll();
        var providerId = providers.models[0].id
        RouterUtl.getInstance().transitionTo("provider", {id: providerId});
    },

    componentDidMount: function () {
      stores.ProviderStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProviderStore.removeChangeListener(this.updateState);
    },


    render: function () {
      var providers = this.state.providers;
debugger
      if (!providers) return <div className="loading"></div>;

      return (
        <div>
          <div className = "container">
            <div className = "col-md-2">

                <ProviderLinks
                    ulClass = "nav nav-stacked provider-list"
                    listData = {providers}
                    linkTarget = "provider" />

            </div>
            <RouteHandler/>
          </div>
        </div>
      );
    }

  });

});
