/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'models/session',
    'react',
    'controllers/projects',
    'components/projects/List.react'
  ],
  function (Marionette, Root, Session, React, ProjectController, Projects) {
    'use strict';

    var session = new Session({
      access_token: "fake-token",
      expires: "it's a mystery!"
    });

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showProjects',
        'projects': 'showProjects'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content){
        var app = Root({
          session: session,
          content: content,
          route: Backbone.history.getFragment()
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

          this.render(content);
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
