define(function (require) {
  "use strict";

  var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    stores = require('stores');

  return React.createClass({

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

    renderProvider: function (provider) {
      return (
        <li key={provider.id}>
          <Router.Link to="provider" params={{providerId: provider.id}}>
            {provider.get('name')}
          </Router.Link>
        </li>
      )
    },

    render: function () {
      var providers = this.state.providers;

      if (!providers) return <div className="loading"></div>;

      return (
        <div>
          <div className="container">
            <div className="col-md-2">
              <ul className="nav nav-stacked provider-list">
                {providers.map(this.renderProvider)}
              </ul>
            </div>
            <RouteHandler/>
          </div>
        </div>
      );
    }

  });

});
