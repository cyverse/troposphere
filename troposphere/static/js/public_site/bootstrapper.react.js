define(function (require) {
    'use strict';

    var React = require('react/addons'),
        Profile = require('models/Profile'),
        $ = require('jquery'),
        Router = require('../Router'),
        routes = require('./AppRoutes.react');

    var modals = require('modals');
    modals.PublicModals = require('modals/PublicModals');

    // Register which stores the application should use
    var stores = require('stores');
    stores.ImageStore = require('stores/ImageStore');
    stores.ImageBookmarkStore = require('stores/ImageBookmarkStore');
    stores.ImageVersionStore = require('stores/ImageVersionStore');
    stores.TagStore         = require('stores/TagStore');
    stores.HelpLinkStore    = require('stores/HelpLinkStore');
    // Mock out the profile store with an empty profile
    stores.ProfileStore = {
      get: function(){
        return new Profile({icon_set: "default"})
      },
      addChangeListener: function(){},
      removeChangeListener: function(){}
    };
    // Mock out the maintenance message store
    stores.MaintenanceMessageStore = {
      getAll: function(){},
      addChangeListener: function(){},
      removeChangeListener: function(){}
    };

    function startApplication() {

      $(document).ready(function () {

        $('body').removeClass('splash-screen');

        // Start the application router
        Router.getInstance(routes).run(function (Handler, state) {
          // you might want to push the state of the router to a store for whatever reason
          // RouterActions.routeChange({routerState: state});

          // whenever the url changes, this callback is called again
          React.render(<Handler/>, document.getElementById("application"));
        });
      });
    }

  return {
    run: function () {
      startApplication();
    }
  }

});
