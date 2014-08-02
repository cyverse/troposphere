/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/projects/ProjectListPage.react',
    'components/projects/ProjectDetailsPage.react',
    'components/projects/VolumeDetailsPage.react',
    'components/projects/InstanceDetailsPage.react',
    'components/projects/RequestImagePage.react',
    'components/projects/ReportInstancePage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, ProjectListPage, ProjectDetailsPage, VolumeDetailsPage, InstanceDetailsPage, RequestImagePage, ReportInstancePage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'projects': 'showProjects',
        'projects/:id': 'showProjectDetails',
        'projects/:id/volumes/:id': 'showProjectVolumeDetails',
        'projects/:id/instances/:id': 'showProjectInstanceDetails',
        'projects/:id/instances/:id/request_image': 'showRequestImagePage',
        'projects/:id/instances/:id/report': 'showReportInstancePage'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content, route){
        var app = Root({
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
      },

      showProjectInstanceDetails: function(projectId, instanceId){
        this.render(InstanceDetailsPage({
          projectId: projectId,
          instanceId: instanceId
        }), ["projects"]);
      },

      showRequestImagePage: function(projectId, instanceId){
        this.render(RequestImagePage({
          projectId: projectId,
          instanceId: instanceId
        }), ["projects"]);
      },

      showReportInstancePage: function(projectId, instanceId){
        this.render(ReportInstancePage({
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
