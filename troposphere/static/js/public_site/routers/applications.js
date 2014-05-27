/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'models/session',
    'react',
    'components/applications/list/ApplicationsHome.react',
    'components/applications/detail/ApplicationDetail.react',
    'collections/applications',
    'models/application',
    'rsvp',
    'context'
  ],
  function (Marionette, Root, Session, React, ApplicationList, ApplicationDetail, Applications, Application, RSVP, context) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showImages',
        'images': 'showImages',
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
      // Fetching functions
      //
      fetchApplication: function (appId) {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var application = new Application({id: appId});
          application.fetch().done(function () {
            resolve(application);
          });
        });
        return promise;
      },

      fetchApplications: function () {
        return new RSVP.Promise(function (resolve, reject) {
          var apps = new Applications();
          apps.fetch().done(function () {
            resolve(apps);
          });
        });
      },

      //
      // Route handlers
      //
      showImages: function () {
        this.fetchApplications().then(function (apps) {
          var content = ApplicationList({
            applications: apps
          });
          this.render(content, "images");
        }.bind(this));

        this.render(ApplicationList(), "images");
      },

      showAppDetail: function (appId) {

        this.fetchApplication(appId).then(function (application) {
          var content = ApplicationDetail({
            application: application
            //onRequestApplication: this.fetchApplication.bind(this, appId),
            //onRequestIdentities: this.fetchIdentities,
            //profile: this.state.profile,
            //identities: this.state.identities,
            //providers: this.state.providers
          });
          this.render(content, "images");
        }.bind(this));
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
