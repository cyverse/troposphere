define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
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

    componentDidMount: function () {
      stores.ProviderStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProviderStore.removeChangeListener(this.updateState);
    },


    render: function () {
      var providers = this.state.providers;

      if (!providers) return <div className="loading"></div>;

      return (
        <div>
          <div className = "container">
            <div className = "col-md-2">

                <ProviderLinks
                    className = "nav nav-stacked provider-list"
                    listItems = {providers} />

            </div>
            <RouteHandler/>
          </div>
        </div>
      );
    }

  });

});
