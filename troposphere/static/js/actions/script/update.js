import ScriptConstants from "constants/ScriptConstants";
import Utils from "../Utils";

export default {

    update: function(script, newAttributes) {
        if (!(newAttributes.title))
            throw new Error("Missing title");
        if (!newAttributes.type)
            throw new Error("Missing type");
        if (!newAttributes.text)
            throw new Error("Missing text");

        script.set(newAttributes);

        script.save(newAttributes, {patch: true}).done(function() {
            // Nothing to do here
        }).fail(function(response) {
            Utils.displayError({
                title: "Script could not be saved",
                response: response
            });
        }).always(function() {
            Utils.dispatch(ScriptConstants.UPDATE_SCRIPT, {
                script: script
            });
        });
        return script;
    }

};
