define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/NullProjectConstants',
    'constants/NullProjectInstanceConstants',
    'constants/NullProjectVolumeConstants',
    './modalHelpers/NullProjectModalHelpers',
    'controllers/NotificationController',
    'actions/ProjectInstanceActions',
    'actions/ProjectVolumeActions',
    'models/Project',
    'constants/ProjectConstants',
    'actions/ProjectActions',
    'stores/InstanceStore',
    'stores/VolumeStore'
  ],
  function (React, AppDispatcher, NullProjectConstants, NullProjectInstanceConstants, NullProjectVolumeConstants, NullProjectModalHelpers, NotificationController, ProjectInstanceActions, ProjectVolumeActions, Project, ProjectConstants, ProjectActions, InstanceStore, VolumeStore) {

    return {

      dispatch: function(actionType, payload, options){
        options = options || {};
        AppDispatcher.handleRouteAction({
          actionType: actionType,
          payload: payload,
          options: options
        });
      },

      // ------------------------
      // Standard CRUD Operations
      // ------------------------

      migrateResourcesIntoProject: function (nullProject) {
        var that = this;
        var instances = InstanceStore.getInstancesInProject(nullProject);
        var volumes = VolumeStore.getVolumesInProject(nullProject);


        var resources = new Backbone.Collection();
        instances.each(function(instance){
          resources.push(instance);
        });
        volumes.each(function(volume){
          resources.push(volume);
        });

        NullProjectModalHelpers.migrateResources({
          nullProject: nullProject,
          resources: resources
        },{
          onConfirm: function(projectName){

            var project = new Project({
              name: projectName,
              description: projectName
            });

            var resourcesClone = resources.models.slice(0);

            that.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

            project.save().done(function(){
              NotificationController.success(null, "Project " + project.get('name') + " created.");
              that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});

              resourcesClone.map(function(resource){
                 ProjectActions.addResourceToProject(resource, project);
              });

            }).fail(function(){
              var message = "Error creating Project " + project.get('name') + ".";
              NotificationController.error(null, message);
              that.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
            });

          }
        });
      }

    };

  });
