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

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showProjects',
        'projects': 'showProjects'
      }
    });

    var Controller = Marionette.Controller.extend({

      fetchProjects: function(){
        return ProjectController.get();
      },

      showProjects: function (param) {

        var session = new Session({
          access_token: "fake-token",
          expires: "it's a mystery!"
        });

        this.fetchProjects().then(function(projects){
          var projectsComponent = Projects({
            projects: projects,
            onRequestProjects: function(){}
          });

          var app = Root({session: session, content: projectsComponent});
          React.renderComponent(app, document.getElementById('application'));
        });

        var app = Root({session: session});
        React.renderComponent(app, document.getElementById('application'));
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
