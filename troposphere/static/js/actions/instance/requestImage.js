import globals from "globals";
import $ from "jquery";
import Utils from "../Utils";

export default {

    requestImage: function(params) {

        if (!params.instance)
            throw new Error("Missing instance");
        if (!params.name)
            throw new Error("Missing name");
        if (!params.description)
            throw new Error("Missing description");
        if (!params.tags)
            throw new Error("Missing tags");
        if (params.versionFork == undefined)
            throw new Error("Missing create/update flag(fork)");
        if (!params.versionName)
            throw new Error("Missing name");
        if (!params.versionChanges)
            throw new Error("Missing description");
        // if(!params.providerId) throw new Error("Missing providerId");
        // if(!params.software) throw new Error("Missing software");
        // if(!params.filesToExclude) throw new Error("Missing filesToExclude");
        // if(!params.systemFiles) throw new Error("Missing systemFiles");
        if (!params.scripts)
            throw new Error("Missing scripts");
        if (!params.identity)
            throw new Error("Missing identity");
        if (!params.licenses)
            throw new Error("Missing licenses");
        if (!params.visibility)
            throw new Error("Missing visibility");
        if (!params.newApplicationAccessList)
            throw new Error("Missing newApplicationAccessList");
        if (!params.imageUsers)
            throw new Error("Missing imageUsers");

        var instance = params.instance.get("id"),
            name = params.name,
            description = params.description,
            minMem = params.minMem,
            minCPU = params.minCPU,
            identity = params.identity,
            software = params.software || "[no files specified]",
            filesToExclude = params.filesToExclude || "[no files specified]",
            fork = params.versionFork,
            versionName = params.versionName,
            newMachineOwner = params.newMachineOwner,
            newApplicationAccessList = params.newApplicationAccessList.map(function(access_pattern) {
                return access_pattern.id;
            }),
            versionChanges = params.versionChanges,
            systemFiles = params.systemFiles || "[no files specified]",
            visibility = params.visibility,
            imageUsers = params.imageUsers,
            userNameList = imageUsers.map(function(user) {
                return user.get("username");
            }),
            tags = params.tags,
            tagNameList = tags.map(function(tag) {
                return tag.get("name");
            }),
            scripts = params.scripts,
            licenses = params.licenses,
            userNames = userNameList.join(", "),
            tagNames = tagNameList.join(", ");

        var requestData = {
            access_list: userNames,
            exclude_files: filesToExclude,
            installed_software: software,
            instance: instance,
            identity: identity,
            iplant_sys_files: systemFiles,
            new_application_description: description,
            new_application_name: name,
            new_version_memory_min: minMem,
            new_version_cpu_min: minCPU,
            new_application_visibility: visibility,
            new_application_access_list: newApplicationAccessList,
            new_machine_owner: newMachineOwner,
            new_version_allow_imaging: true,
            new_version_change_log: versionChanges,
            new_version_forked: fork,
            new_version_name: versionName,
            new_version_tags: tagNames,
            new_version_scripts: scripts,
            new_version_licenses: licenses
        };


        var requestUrl = (
        globals.API_V2_ROOT + "/machine_requests"
        );

        $.ajax({
            url: requestUrl,
            type: "POST",
            data: JSON.stringify(requestData),
            dataType: "json",
            contentType: "application/json",
            success: function(model) {
                Utils.displaySuccess({
                    message: "Your image request has been sent to support."
                });
            },
            error: function(response, status, error) {
                Utils.displayError({
                    title: "Your image request could not be sent",
                    response: response
                });
            }
        });
    }

};
