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
        if (!newAttributes.strategy)
            throw new Error("Missing strategy");
        if (newAttributes.wait_for_deploy == null)
            throw new Error("Missing wait_for_deploy");

        // Save attributes, before we optimistically update them
        let prevAttibutes = Object.assign({}, script.attributes);

        // Optimistic update
        script.set(newAttributes);
        Utils.dispatch(ScriptConstants.UPDATE_SCRIPT, { script });

        script.save(newAttributes, {patch: true})
            .fail(response => {
                Utils.displayError({
                    title: "Script could not be saved",
                    response: response
                });

                // Restore attributes prior to `set()`
                script.set(prevAttibutes);

                // Emit the undo
                Utils.dispatch(ScriptConstants.UPDATE_SCRIPT, { script });
            })
        return script;
    }

};
