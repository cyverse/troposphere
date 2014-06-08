/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/projects/ProjectListPage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, ProjectListPage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'projects': 'showProjects'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content, route){
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      showProjects: function (param) {
        this.render(ProjectListPage(), "projects");
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
