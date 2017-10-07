
import ScriptConstants from "constants/ScriptConstants";
import Script from "models/Script";
import actions from "actions";
import Utils from "../Utils";

export default {

    create_AddToImageVersion: function(image_version, params) {

        if (!params.title)
            throw new Error("Missing title");
        if (!params.type)
            throw new Error("Missing type");
        if (!params.text)
            throw new Error("Missing text");
        if (!params.strategy)
            throw new Error("Missing strategy");
        if (params.wait_for_deploy == null)
            throw new Error("Missing wait_for_deploy");

        var title = params.title,
            script_type = params.type,
            wait_for_deploy = params.wait_for_deploy,
            text = params.text;

        var script = new Script({
            title: title,
            type: script_type,
            text: text,
            wait_for_deploy
        });

        // Add the script optimistically
        Utils.dispatch(ScriptConstants.ADD_SCRIPT, {
            script: script
        }, {
            silent: false
        });

        script.save().done(function() {
            Utils.dispatch(ScriptConstants.UPDATE_SCRIPT, {
                script: script
            }, {
                silent: false
            });
            Utils.dispatch(ScriptConstants.REMOVE_PENDING_SCRIPT_FROM_VERSION, {
                script: script,
                image_version: image_version
            });
            actions.ImageVersionScriptActions.add({
                image_version: image_version,
                script: script
            });
        }).fail(function() {
            Utils.dispatch(ScriptConstants.REMOVE_SCRIPT, {
                script: script
            }, {
                silent: false
            });
            Utils.dispatch(ScriptConstants.REMOVE_PENDING_SCRIPT_FROM_VERSION, {
                script: script,
                image_version: image_version
            });
        });

        Utils.dispatch(ScriptConstants.ADD_PENDING_SCRIPT_TO_VERSION, {
            script: script,
            image_version: image_version
        });

    }

};
