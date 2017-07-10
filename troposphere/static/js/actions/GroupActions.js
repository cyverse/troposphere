import Utils from "./Utils";
import NotificationController from "controllers/NotificationController";

// Constants
import GroupConstants from "constants/GroupConstants";

// Models
import Group from "models/Group";


export default {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    update: function(group, newAttributes) {
        if (!group)
            throw new Error("Missing group");
        if (!newAttributes || !newAttributes.name || !newAttributes.users)
            throw new Error("Expected name and users in attributes. received " + newAttributes)

        group.set(newAttributes);
        group.save(newAttributes, {patch: true}).done(
            function() {
            Utils.dispatch(GroupConstants.UPDATE_GROUP, {
                model: group
            });
        });
    },
    create: function(params, onSuccess, onFailure) {
        var group = new Group(params)


        Utils.dispatch(GroupConstants.ADD_GROUP, {
            group: group
        });

        group.save().done(function() {
            // NotificationController.success(null, "Group " + group.get('name') + " created.");
            Utils.dispatch(GroupConstants.UPDATE_GROUP, {
                group: group
            });
            if (onSuccess != null) {
                onSuccess(group);
            }

        }).fail(function(response) {
            var err_response = response.responseJSON || response.responseText;
            var message = "Error creating Group " + group.get("name") + ":" + err_response;
            NotificationController.error(null, message);
            Utils.dispatch(GroupConstants.REMOVE_GROUP, {
                group: group
            });
            if (onFailure != null) {
                onFailure(group);
            }
        });
    }
};
