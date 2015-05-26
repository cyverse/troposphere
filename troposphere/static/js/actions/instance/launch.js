define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      ProjectConstants = require('constants/ProjectConstants'),
      Instance = require('models/Instance'),
      Project = require('models/Project'),
      Router = require('Router'),
      actions = require('actions'),
      Utils = require('../Utils');

  function launch(params){
    if(!params.project) throw new Error("Missing project");
    if(!params.instanceName) throw new Error("Missing instanceName");
    if(!params.identity) throw new Error("Missing identity");
    if(!params.size) throw new Error("Missing size");
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

    Utils.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});
    // todo: hook this back up if experience seems to slow...not connected right now
    // Utils.dispatch(ProjectInstanceConstants.ADD_PENDING_INSTANCE_TO_PROJECT, {
    //   instance: instance,
    //   project: project
    // });

    instance.createOnV1Endpoint({
      name: instanceName,
      size_alias: size.get('alias'),
      machine_alias: machine.get('uuid')
    }).done(function(attrs, status, response) {
      instance.set('id', attrs.id);
      instance.fetch().done(function(){
        // todo: remove hack and start using ProjectInstance endpoint to discover
        // which project an instance is in
        instance.set('projects', [project.id]);

        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

        // todo: hook this back up if experience seems to slow...not connected right now
        // Utils.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
        //   instance: instance,
        //   project: project
        // });

        actions.ProjectInstanceActions.addInstanceToProject({
          project: project,
          instance: instance
        });
      });
    }).fail(function (response) {
      Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
      Utils.displayError({title: "Instance could not be launched", response: response});

      // todo: hook this back up if experience seems to slow...not connected right now
      // Utils.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
      //   instance: instance,
      //   project: project
      // });
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
