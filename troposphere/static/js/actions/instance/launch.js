import { appBrowserHistory } from "utilities/historyFunctions";

import Utils from "../Utils";

//
// Constants
//
import InstanceConstants from "constants/InstanceConstants";
import ProjectInstanceConstants from "constants/ProjectInstanceConstants";

//
// Models
//
import Instance from "models/Instance";
import ProjectInstance from "models/ProjectInstance";

import globals from "globals";


function launch(params) {
    if (!params.project)
        throw new Error("Missing project");
    if (!params.instanceName)
        throw new Error("Missing instanceName");
    if (!params.identity)
        throw new Error("Missing identity");
    if (!params.size)
        throw new Error("Missing size");
    if (params.version) {
        let machines = params.version.get("machines"),
            selected_machines = machines.filter(function(machine) {
                return machine.provider.uuid === params.identity.get("provider").uuid;
            });
        if (!selected_machines.length) {
            throw new Error("Machine could not be filtered-down based on selected version & identity")
        }
        params.machine = selected_machines[0]
    }
    if (!params.machine)
        throw new Error("Missing machine");

    let { project,
          instanceName,
          identity,
          size,
          machine,
          scripts,
          onSuccess,
          onFail } = params;

    let instance = new Instance({
        name: instanceName,
        size: {
            id: size.id,
            alias: size.get("alias")
        },
        status: "build - requesting_launch",
        provider: {
            id: identity.get("provider").id,
            uuid: identity.get("provider").uuid
        },
        project: project.id,
        identity: {
            id: identity.id,
            uuid: identity.get("uuid")
        }
    }, {
        parse: true
    });

    // Add instance to InstanceStore
    Utils.dispatch(InstanceConstants.ADD_INSTANCE, {
        instance: instance
    });

    // Create ProjectInstance
    let projectInstance = new ProjectInstance({
        project: project.toJSON(),
        instance: instance.toJSON()
    });

    // Add to ProjectInstanceStore
    Utils.dispatch(ProjectInstanceConstants.ADD_PROJECT_INSTANCE, {
        projectInstance: projectInstance
    });

    let payload = {
        name: instanceName,
        size_alias: size.get("alias"),
        source_alias: machine.uuid,
        scripts: scripts,
        project: project
    }

    if (globals.USE_ALLOCATION_SOURCES) {
        payload.allocation_source_id = params.allocation_source_uuid;
    }

    // Create Instance using the v2 API endpoint
    instance.create(payload)
        .done(function(attrs, status, response) {
            instance.set("id", attrs.id);
            instance.set("uuid", attrs.alias);

            // Get the instance from the cloud, ignore our local copy
            instance.fetch().then(function() {
                Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
                    instance: instance
                });
            }, function() {
                /**
                 * this can have the same function signature as a `fail`
                 *
                 * the arguments would be: (jqXHR, textStatus, errorThrown)
                 */
                Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
                    instance: instance
                });
            });

            onSuccess();

            // only change _context_ if we have succeeded in launching
            appBrowserHistory.push(`/projects/${project.id}/resources`);

        }).fail(function(response) {
            // Remove instance from stores
            Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {
                instance: instance
            });
            Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {
                projectInstance: projectInstance
            });
            Utils.displayError({
                title: "Instance could not be launched",
                response: response
            });

            onFail();
        });
}

export default {
    launch
};
