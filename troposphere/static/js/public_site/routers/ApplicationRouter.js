define(function (require) {
    'use strict';

    var Marionette                   = require('marionette'),
        Root                         = require('components/Root.react'),
        React                        = require('react'),
        context                      = require('context'),
        ApplicationListView          = require('components/applications/list/ApplicationListView.react'),
        ApplicationDetail            = require('components/applications/detail/ApplicationDetail.react'),
        ApplicationSearchResultsPage = require('components/applications/ApplicationSearchResultsPage.react'),
        Backbone                     = require('backbone');

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showImages',
        'images': 'showImages',
        'images/:id': 'showAppDetail',
        'images/search/:query': 'showApplicationSearchResults',
        '*path': 'defaultRoute'
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

      defaultRoute: function () {
        Backbone.history.navigate('', {trigger: true});
      },

      showImages: function () {
        this.render(ApplicationListView(), ["images"]);
      },

      showAppDetail: function (appId) {
        var content = ApplicationDetail({
          applicationId: appId
        });
        this.render(content, ["images"]);
      },

      showApplicationSearchResults: function (query) {
        var content = ApplicationSearchResultsPage({
          query: query
        });
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
