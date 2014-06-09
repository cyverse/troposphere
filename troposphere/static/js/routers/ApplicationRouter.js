define(function (require) {
    'use strict';

    var Marionette                   = require('marionette'),
        Root                         = require('components/Root.react'),
        React                        = require('react'),
        ApplicationListView          = require('components/applications/list/ApplicationListView.react'),
        ApplicationDetail            = require('components/applications/detail/ApplicationDetail.react'),
        //SearchResults                = require('components/applications/search/SearchResults.react'),
        ApplicationSearchResultsPage = require('components/applications/ApplicationSearchResultsPage.react'),
        FavoritedApplicationsPage    = require('components/applications/FavoritedApplicationsPage.react'),
        MyApplicationsPage           = require('components/applications/MyApplicationsPage.react'),
        RSVP                         = require('rsvp'),
        context                      = require('context'),
        ApplicationActions           = require('actions/ApplicationActions'),
        Backbone                     = require('backbone');


    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'images': 'showImages',
        'images/search/:query': 'showApplicationSearchResults',
        'images/favorites': 'showFavoritedApplications',
        'images/authored': 'showAuthoredApplications',
        'images/:id': 'showAppDetail'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content, route) {
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      //
      // Route handlers
      //
      showImages: function () {
        this.render(ApplicationListView(), ["images"]);
      },

      showFavoritedApplications: function () {
        this.render(FavoritedApplicationsPage(), ["images","favorites"]);
      },

      showAuthoredApplications: function () {
        this.render(MyApplicationsPage(), ["images", "authored"]);
      },

      showAppDetail: function (appId) {
        var content = ApplicationDetail({
          applicationId: appId
        });
        this.render(content, ["images"]);
      },

      showApplicationSearchResults: function (query) {
        var content = ApplicationSearchResultsPage({query: query});
        this.render(content, ["images", "search"]);
      }

    });

    return {
      start: function () {
        var controller = new Controller();
        var router = new Router({
          controller: controller
        });
      }
    }

  });
