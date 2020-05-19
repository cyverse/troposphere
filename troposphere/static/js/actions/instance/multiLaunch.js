import {appBrowserHistory} from "utilities/historyFunctions";

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

function multiLaunch(params) {
    if (!params.project) throw new Error("Missing project");
    if (!params.instanceName) throw new Error("Missing instanceName");
    if (!params.identity) throw new Error("Missing identity");
    if (!params.size) throw new Error("Missing size");
    if (params.version) {
        let machines = params.version.get("machines"),
            selected_machines = machines.filter(function(machine) {
                return (
                    machine.provider.uuid ===
                    params.identity.get("provider").uuid
                );
            });
        if (!selected_machines.length) {
            throw new Error(
                "Machine could not be filtered-down based on selected version & identity"
            );
        }
        params.machine = selected_machines[0];
    }
    if (!params.machine) throw new Error("Missing machine");
    if (!params.instanceCount) {
        throw new Error("missing instanceCount");
    }
    if (!Number.isInteger(params.instanceCount)) {
        throw new Error("Instance count should be an integer");
    }
    if (params.instanceCount < 1) {
        throw new Error("Instance count should be a postive integer");
    }
    if (params.instanceCount <= 1) {
        throw new Error("Multi launch require instance count > 1");
    }

    let {
        project,
        instanceName,
        identity,
        size,
        machine,
        scripts,
        instanceCount,
        onSuccess,
        onFail
    } = params;

    let instances = [];
    let projectInstances = [];

    for (let i = 0; i < instanceCount; i++) {
        // Create Instance
        let instance = new Instance(
            {
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
            },
            {
                parse: true
            }
        );
        // Create ProjectInstance
        let projectInstance = new ProjectInstance({
            project: project.toJSON(),
            instance: instance.toJSON()
        });
        instances.push(instance);
        projectInstances.push(projectInstance);
    }

    for (let i = 0; i < instanceCount; i++) {
        // Add instance to InstanceStore
        Utils.dispatch(InstanceConstants.ADD_INSTANCE, {
            instance: instances[i]
        });

        // Add to ProjectInstanceStore
        Utils.dispatch(ProjectInstanceConstants.ADD_PROJECT_INSTANCE, {
            projectInstance: projectInstances[i]
        });
    }

    let payload = {
        name: instanceName,
        size_alias: size.get("alias"),
        source_alias: machine.uuid,
        scripts: scripts,
        project: project,
        allocation_source_id: params.allocation_source_uuid,
        instance_count: instanceCount
    };

    // Create Instance using the v2 API endpoint
    instances[0]
        .create(payload)
        .done(function(attrs, status, response) {
            // Response to a multi-launch must be an array
            if (!Array.isArray(attrs)) {
                throw new Error("Response does not contain array");
            }

            // launched fewer instances than requsted
            if (attrs.length < instances.length) {
                Utils.displayError({
                    title: "Some instances failed to launch",
                    response: {
                        status: status,
                        responseText:
                            "Only launched " +
                            attrs.length +
                            " out of " +
                            instances.length +
                            " instances"
                    }
                });
            }

            // if multi launch, attrs is an array
            for (let i = 0; i < attrs.length; i++) {
                instances[i].set("id", attrs[i].id);
                instances[i].set("uuid", attrs[i].alias);

                // Get the instance from the cloud, ignore our local copy
                instances[i].fetch().then(
                    function() {
                        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
                            instance: instances[i]
                        });
                    },
                    function() {
                        /**
                         * this can have the same function signature as a `fail`
                         *
                         * the arguments would be: (jqXHR, textStatus, errorThrown)
                         */
                        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
                            instance: instances[i]
                        });
                    }
                );
            }

            onSuccess();

            // only change _context_ if we have succeeded in launching
            appBrowserHistory.push(`/projects/${project.id}/resources`);
        })
        .fail(function(response) {
            // Remove instances from stores
            for (let i = 0; i < instanceCount; i++) {
                Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {
                    instance: instances[i]
                });
                Utils.dispatch(
                    ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE,
                    {
                        projectInstance: projectInstances[i]
                    }
                );
            }
            Utils.displayError({
                title: "Instances could not be launched",
                response: response
            });

            onFail();
        });
}

export default {
    multiLaunch
};
