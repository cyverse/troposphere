/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/projects/ProjectListPage.react',
    'components/projects/ProjectDetailsPage.react',
    'components/projects/VolumeDetailsPage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, ProjectListPage, ProjectDetailsPage, VolumeDetailsPage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'projects': 'showProjects',
        'projects/:id': 'showProjectDetails',
        'projects/:id/volumes/:id': 'showProjectVolumeDetails'
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
        this.render(ProjectListPage(), ["projects"]);
      },

      showProjectDetails: function (projectId) {
        this.render(ProjectDetailsPage({
          projectId: projectId
        }), ["projects"]);
      },

      showProjectVolumeDetails: function(projectId, volumeId){
        this.render(VolumeDetailsPage({
          projectId: projectId,
          volumeId: volumeId
        }), ["projects"]);
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
