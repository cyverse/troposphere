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

  function launch(params) {
    if(!params.project) throw new Error("Missing project");
    if(!params.instanceName) throw new Error("Missing instanceName");
    if(!params.identity) throw new Error("Missing identity");
    if(!params.size) throw new Error("Missing size");
    if(params.version) {
        //Determine 'machine' from selected version and identity
        //var machines = stores.ImageVersionStore.getMachines(params.version.id),

        var machines = params.version.get('machines'),
        selected_machines = machines.filter(function(machine) {
          return machine.provider.uuid === params.identity.get('provider').uuid;
        });
        if(!selected_machines.length)
            throw new Error("Machine could not be filtered-down based on selected version & identity")
        params.machine = selected_machines[0]
    }
    if (!params.machine) throw new Error("Missing machine");

    var project = params.project,
        instanceName = params.instanceName,
        identity = params.identity,
        size = params.size,
        machine = params.machine,
        scripts = params.scripts;

    var instance = new Instance({
      name: instanceName,
      size: {
        id: size.id,
        alias: size.get('alias')
      },
      status: "build - requesting_launch",
      provider: {
        id: identity.get('provider').id,
        uuid: identity.get('provider').uuid
      },
      projects: [ project.id ],
      identity: {
        id: identity.id,
        uuid: identity.get('uuid')
      },
    }, {parse: true});

    // Add instance to InstanceStore
    Utils.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});

    // Create ProjectInstance
    var projectInstance = new ProjectInstance({
      project: project.toJSON(),
      instance: instance.toJSON()
    });

    // Add to ProjectInstanceStore
    Utils.dispatch(ProjectInstanceConstants.ADD_PROJECT_INSTANCE, {projectInstance: projectInstance});

    instance.createOnV1Endpoint({
      name: instanceName,
      size_alias: size.get('alias'),
      machine_alias: machine.uuid,
      scripts: scripts,
    }).done(function(attrs, status, response) {
        instance.set('id', attrs.id);

        // Get the instance from the cloud, ignore our local copy
        instance.fetch().done(function() {
            // NOTE: we have to set this here, because our instance above never gets saved
            instance.set('projects', [project.id]);

            Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
            Utils.dispatch(InstanceConstants.PUSH_INSTANCE, {instance: instance});
        });

        // Save projectInstance to db
        projectInstance.save(null, {attrs: {
            project: project.id,
            instance: instance.id
        }});

    }).fail(function (response) {
      // Remove instance from stores
      Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
      Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {projectInstance: projectInstance});
      Utils.displayError({title: "Instance could not be launched", response: response});
    });

    // Since this is triggered from the images page, navigate off
    // that page and back to the instance list so the user can see
    // their instance being created
    Router.getInstance().transitionTo("project-resources", {projectId: project.id});
  }

  return {

    createProjectAndLaunchInstance: function (params) {
      if (!params.projectName) throw new Error("Missing projectName");

      var projectName = params.projectName,
        project = new Project({
          name: projectName,
          description: projectName,
          instances: [],
          volumes: []
        });

      Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

      project.save().done(function() {
        Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});

        // launch the instance into the project
        params.project = project;
        delete params['projectName'];
        launch(params);

        // Since this is triggered from the images page, navigate off
        // that page and back to the instance list so the user can see
        // their instance being created
        Router.getInstance().transitionTo("project-resources", {projectId: project.id});
      }).fail(function(response) {
        Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
        Utils.displayError({title: "Project could not be created", response: response});
      });
    },

    launch: launch
  };

});
