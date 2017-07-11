
import InstanceConstants from "constants/InstanceConstants";
import Utils from "../Utils";

export default {

    update: function(instance, newAttributes) {
        if (!instance)
            throw new Error("Missing instance");
        if (!newAttributes || (!newAttributes.name && !newAttributes.project))
            throw new Error("Expected name and/or project in attributes. received " + newAttributes)
        let project = newAttributes.project || instance.get('project');
        instance.set(newAttributes);

        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
            instance: instance
        });

        instance.save({
            name: instance.get("name"),
            project: project.id
        }, {
            patch: true //FIXME: Why is 'merge' not in here (like it is in volume/update.js)?
        }).done(function() {
            // Nothing to do here
        }).fail(function(response) {
            Utils.displayError({
                title: "Instance could not be updated",
                response: response
            });
        }).always(function() {
            Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
                instance: instance
            });
            Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
                instance: instance
            });
        });
    }

};
