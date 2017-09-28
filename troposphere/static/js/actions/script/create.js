import ScriptConstants from "constants/ScriptConstants";
import Script from "models/Script";
import Utils from "../Utils";

export default {

    create: function({ title, type, text, strategy }) {
        if (!title)
            throw new Error("Missing title");
        if (!type)
            throw new Error("Missing type");
        if (!text)
            throw new Error("Missing text");
        if (!strategy)
            throw new Error("Missing strategy");

        var script = new Script({
            title,
            type,
            text,
            strategy,
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
        }).fail(function() {
            Utils.dispatch(ScriptConstants.REMOVE_SCRIPT, {
                script: script
            }, {
                silent: false
            });
        });
        return script;
    }

};
