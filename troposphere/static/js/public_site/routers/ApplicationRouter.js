define(function (require) {
    'use strict';

    var Marionette                   = require('marionette'),
        Root                         = require('components/Root.react'),
        React                        = require('react'),
        context                      = require('context'),
        ApplicationListPage          = require('components/applications/ApplicationListPage.react'),
        ApplicationDetailsPage       = require('components/applications/ApplicationDetailsPage.react'),
        ApplicationSearchResultsPage = require('components/applications/ApplicationSearchResultsPage.react'),
        ImageTagsPage                = require('components/applications/ImageTagsPage.react'),
        Backbone                     = require('backbone');

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showApplications',
        'images': 'showApplications',
        'images/tags': 'showImageTags',
        'images/:id': 'showApplicationDetails',
        'images/search/:query': 'showApplicationSearchResults',
        '*path': 'defaultRoute'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content, route) {
        var Component = React.createFactory(Root);
        var app = Component({
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.render(app, document.getElementById('application'));
      },

      //
      // Route handlers
      //

      defaultRoute: function () {
        Backbone.history.navigate('', {trigger: true});
      },

      showApplications: function () {
        var Component = React.createFactory(ApplicationListPage);
        this.render(Component(), ["images"]);
      },

      showImageTags: function () {
        var Component = React.createFactory(ImageTagsPage);
        this.render(Component(), ["images", "tags"]);
      },

      showApplicationDetails: function (appId) {
        var Component = React.createFactory(ApplicationDetailsPage);
        var content = Component({
          applicationId: appId
        });
        this.render(content, ["images"]);
      },

      showApplicationSearchResults: function (query) {
        var Component = React.createFactory(ApplicationSearchResultsPage);
        var content = Component({query: query});
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
