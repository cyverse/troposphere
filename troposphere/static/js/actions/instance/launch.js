define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      ProjectConstants = require('constants/ProjectConstants'),
      Instance = require('models/Instance'),
      Project = require('models/Project'),
      Router = require('Router'),
      actions = require('actions'),
      Utils = require('../Utils'),
      ProjectInstance = require('models/ProjectInstance');

  function launch(params){
    if(!params.project) throw new Error("Missing project");
    if(!params.instanceName) throw new Error("Missing instanceName");
    if(!params.identity) throw new Error("Missing identity");
    if(!params.size) throw new Error("Missing size");
    if(params.version) {
        //Determine 'machine' from selected version and identity
        var machines = params.version.getMachines(),
            selected_machines = machines.filter(
            function(machine) {
                return machine.provider.uuid === params.identity.get('provider').uuid;
            });
        if(!selected_machines.length)
            throw new Error("Machine could not be filtered-down based on selected version & identity")
        params.machine = selected_machines[0]
    }
    if(!params.machine) throw new Error("Missing machine");

    var project = params.project,
        instanceName = params.instanceName,
        identity = params.identity,
        size = params.size,
        machine = params.machine;

    var instance = new Instance({
      name: instanceName,
      size: {
        id: size.id,
        alias: size.get('alias')
      },
      status: "build - scheduling",
      provider: {
        id: identity.get('provider').id,
        uuid: identity.get('provider').uuid
      },
      identity: {
        id: identity.id,
        uuid: identity.get('uuid')
      }
    }, {parse: true});

    var projectInstance = new ProjectInstance({
      project: project.toJSON(),
      instance: instance.toJSON()
    });

    Utils.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});

    // Add the instance to the project now, so the user can see it being requested
    Utils.dispatch(ProjectInstanceConstants.ADD_PENDING_PROJECT_INSTANCE, {
      projectInstance: projectInstance
    });

    instance.createOnV1Endpoint({
      name: instanceName,
      size_alias: size.get('alias'),
      machine_alias: machine.uuid
    }).done(function(attrs, status, response) {
      instance.set('id', attrs.id);
      instance.fetch().done(function(){
        // todo: remove hack and start using ProjectInstance endpoint to discover
        // which project an instance is in
        instance.set('projects', [project.id]);

        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

        actions.ProjectInstanceActions.addInstanceToProject({
          project: project,
          instance: instance
        });
      });
    }).fail(function (response) {
      Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
      Utils.displayError({title: "Instance could not be launched", response: response});
    }).always(function(){
      // Remove the instance from the project now that it's either been created or failed to be created
      Utils.dispatch(ProjectInstanceConstants.REMOVE_PENDING_PROJECT_INSTANCE, {
        projectInstance: projectInstance
      });
    });

    // Since this is triggered from the images page, navigate off
    // that page and back to the instance list so the user can see
    // their instance being created
    Router.getInstance().transitionTo("project-resources", {projectId: project.id});
  }

  return {

    createProjectAndLaunchInstance: function(params){
      if(!params.projectName) throw new Error("Missing projectName");

      var projectName = params.projectName,
          project = new Project({
            name: projectName,
            description: projectName,
            instances: [],
            volumes:[]
          });

      Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

      project.save().done(function(){
        Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});

        // launch the instance into the project
        params.project = project;
        delete params['projectName'];
        launch(params);

        // Since this is triggered from the images page, navigate off
        // that page and back to the instance list so the user can see
        // their instance being created
        Router.getInstance().transitionTo("project-resources", {projectId: project.id});
      }).fail(function(response){
        Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
        Utils.displayError({title: "Project could not be created", response: response});
      });
    },

    launch: launch
  };

});
