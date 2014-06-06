define(
  [
    'react',
    'collections/projects',
    'models/project',
    'rsvp',
    'controllers/notifications',
    'modal'
  ],
  function (React, Collection, Model, RSVP, Notifications, Modal) {

    var projects = new Collection();

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
        var model = new Model();
        model.save({name: name, description: description}, {
          success: function (model) {
            Notifications.success('Success', 'Created new project "' + model.get('name') + '"');
            resolve(model);
          },
          error: function (model, response) {
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
              Notifications.success("Success", "Project deleted");
              resolve();
            },
            error: function () {
              Notifications.danger("Error", "Project could not be deleted");
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
