define(
  [
    'react',
    'collections/ProjectCollection',
    'models/Project',
    'rsvp',
    'controllers/NotificationController',
    'modal'
  ],
  function (React, ProjectCollection, Project, RSVP, NotificationController, Modal) {

    var projects = new ProjectCollection();

    var getProjects = function () {
      return new RSVP.Promise(function (resolve, reject) {
        projects.fetch({
          success: function(){
            resolve(projects);
          },
          error: reject
        });
      });
    };

    var createProject = function (name, description) {
      return new RSVP.Promise(function (resolve, reject) {
        var project = new Project();
        project.save({name: name, description: description}, {
          success: function (attr) {
            NotificationController.success('Success', 'Created new project "' + project.get('name') + '"');
            resolve(project);
          },
          error: function (attr, response) {
            reject(response);
          }
        });
      });
    };

    var deleteProject = function (project) {
      var header = "Delete project " + project.get('name');
      var body = 'Are you sure you would like to delete project "' + project.get('name') + '"?';

      var onConfirm = function () {
        return new RSVP.Promise(function (resolve, reject) {
          project.destroy({
            wait: true,
            success: function () {
              NotificationController.success("Success", "Project deleted");
              resolve();
            },
            error: function () {
              NotificationController.danger("Error", "Project could not be deleted");
              resolve();
            }
          });
        });
      };

      Modal.alert(header, body, {
        onConfirm: onConfirm,
        okButtonText: 'Delete project'});
    };

    return {
      create: createProject,
      get: getProjects,
      'delete': deleteProject
    };
  });
