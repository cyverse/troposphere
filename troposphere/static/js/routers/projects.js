/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'models/session',
    'react',
    'controllers/projects',
    'components/projects/List.react',
    'context'
  ],
  function (Marionette, Root, Session, React, ProjectController, Projects, context) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showProjects',
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

      fetchProjects: function(){
        return ProjectController.get();
      },

      showProjects: function (param) {
        this.fetchProjects().then(function (projects) {
          var content = Projects({
            projects: projects,
            onRequestProjects: function () {}
          });

          this.render(content, "projects");
        }.bind(this));

        this.render(null);
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
