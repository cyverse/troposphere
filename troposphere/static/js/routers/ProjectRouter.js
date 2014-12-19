/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/projects/ProjectListPage.react',
    'components/projects/ProjectDetailsPage.react',
    'components/projects/ProjectResourcesPage.react',
    'components/projects/VolumeDetailsPage.react',
    'components/projects/InstanceDetailsPage.react',
    'components/projects/RequestImagePage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, ProjectListPage, ProjectDetailsPage, ProjectResourcesPage, VolumeDetailsPage, InstanceDetailsPage, RequestImagePage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'projects': 'showProjects',
        'projects/:id': 'showProjectDetails',
        'projects/:id/resources': 'showProjectResources',
        'projects/:id/volumes/:id': 'showProjectVolumeDetails',
        'projects/:id/instances/:id': 'showProjectInstanceDetails',
        'projects/:id/instances/:id/request_image': 'showRequestImagePage'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content, route){
        var Component = React.createFactory(Root);
        var app = Component({
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.render(app, document.getElementById('application'));
      },

      showProjects: function (param) {
        var Component = React.createFactory(ProjectListPage);
        this.render(Component(), ["projects"]);
      },

      showProjectDetails: function (projectId) {
        var Component = React.createFactory(ProjectDetailsPage);
        this.render(Component({
          projectId: projectId
        }), ["projects"]);
      },

      showProjectResources: function (projectId) {
        var Component = React.createFactory(ProjectResourcesPage);
        this.render(Component({
          projectId: projectId
        }), ["projects"]);
      },

      showProjectVolumeDetails: function(projectId, volumeId){
        var Component = React.createFactory(VolumeDetailsPage);
        this.render(Component({
          projectId: projectId,
          volumeId: volumeId
        }), ["projects"]);
      },

      showProjectInstanceDetails: function(projectId, instanceId){
        var Component = React.createFactory(InstanceDetailsPage);
        this.render(Component({
          projectId: projectId,
          instanceId: instanceId
        }), ["projects"]);
      },

      showRequestImagePage: function(projectId, instanceId){
        var Component = React.createFactory(RequestImagePage);
        this.render(Component({
          projectId: projectId,
          instanceId: instanceId
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
