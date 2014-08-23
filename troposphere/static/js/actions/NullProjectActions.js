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
    'stores/VolumeStore',
    'url',
    'models/Instance',
    'models/Volume'
  ],
  function (React, AppDispatcher, NullProjectConstants, NullProjectInstanceConstants, NullProjectVolumeConstants, NullProjectModalHelpers, NotificationController, ProjectInstanceActions, ProjectVolumeActions, Project, ProjectConstants, ProjectActions, InstanceStore, VolumeStore, URL, Instance, Volume) {

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

      _migrateResourceIntoProject: function(resource, project){
        ProjectActions.addResourceToProject(resource, project);

        if(resource instanceof Instance){
          this.dispatch(NullProjectInstanceConstants.REMOVE_INSTANCE_FROM_NULL_PROJECT, {
            instance: resource
          });
        }else if(resource instanceof Volume){
          this.dispatch(NullProjectVolumeConstants.REMOVE_VOLUME_FROM_NULL_PROJECT, {
            volume: resource
          });
        }
      },

      _migrateResourcesIntoProject: function(resources, project){
        resources.map(function(resource){
          this._migrateResourceIntoProject(resource, project);
        }.bind(this));

        var redirectUrl = URL.project(project, {relative: true});
        Backbone.history.navigate(redirectUrl, {trigger: true});
      },

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
          onConfirm: function(params){

            var resourcesClone = resources.models.slice(0);
            var project;

            if(params.projectName){
              project = new Project({
                name: params.projectName,
                description: params.projectName,
                instances: [],
                volumes:[]
              });

              that.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

              project.save().done(function(){
                NotificationController.success(null, "Project " + project.get('name') + " created.");
                that.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
                that._migrateResourcesIntoProject(resourcesClone, project);
              }).fail(function(){
                var message = "Error creating Project " + project.get('name') + ".";
                NotificationController.error(null, message);
                that.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
              });

            }else if(params.projectId && params.projects){
              project = params.projects.get(params.projectId);
              that._migrateResourcesIntoProject(resourcesClone, project);

            }else{
              throw new Error("expected either projectName OR projectId and projects parameters")
            }
          }
        });
      }

    };

  });
