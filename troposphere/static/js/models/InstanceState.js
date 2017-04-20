import _ from "underscore";
import Backbone from "backbone";

// InstanceState manages the status/activity of an instance. An instance would
// have an status/activity of active/rebooting for example.

var InstanceState = Backbone.Model.extend({

    isInFinalState: function() {
        var validStates = [
            "active",
            "error",
            "active - deploy_error",
            "active - user_deploy_error",
            "suspended",
            "shutoff"
        ];

        if (this.get("status") === "build")
            return false;
        return _.contains(validStates, this.get("status_raw"));
    },

    // This method is a slight hack, there is a larger problem with how we keep
    // track of state. It is documented in ATMO-1120.
    isDeployError: function() {
        var status = this.get("status");
        var activity = this.get("activity");

        return status === "active" && (activity === "deploy_error" || activity === "user_deploy_error");
    },

    getPercentComplete: function() {
        var status = this.get("status");
        var activity = this.get("activity");
        var percentComplete = get_percent_complete(status, activity);
        return percentComplete;
    },

    initialize: function(attributes, options) {
        var tokens = attributes.status_raw.split("-").map(s => s.trim());
        var status = tokens[0];
        var activity = attributes.activity;

        this.set("status_raw", attributes.status_raw);
        this.set("status", status);
        this.set("activity", activity);
    }

});

var get_percent_complete = function(state, activity) {
    var lookup,
        states = {
            // Number represents percent task *completed* when in this state
            "build": {
                "block_device_mapping": 10,
                "scheduling": 20,
                "networking": 30,
                "spawning": 40,
                "deleting": 50,
            },
            "active": {
                "resizing" : 25,
                "powering-off": 50,
                "image_uploading": 50,
                "deleting": 50,
                "suspending": 50,
                "initializing": 50,
                "networking": 60,
                "deploying": 70,
                "running_boot_script": 90
            },
            "hard_reboot": {
                "rebooting-hard": 50
            },
            "reboot": {
                "rebooting": 50
            },
            "revert_resize": {
                "": 35,
                "resize_reverting": 75,
            },
            "verify_resize": {
                "": 80,
                "confirm_resize": 95,
            },
            "resize": {
                "" : 25,
                "resizing" : 25,
                "resize_migrate" : 35,
                "resize_migrating": 35,
                "resize_migrated": 35,
                "revert_resize": 35,
                "confirm_resize": 35,
                "resize_confirming": 35,
                "resize_finish" : 75,
            },
            "shutoff": {
                "powering-on": 50
            },
            "suspended": {
                "resuming": 50
            },
            "error": {}
        };

    if (!state) {
        state = "error";
    }
    lookup = states[state];

    if (!lookup) {
        lookup = {};
        console.error("Unknown state (%s) representation passed", state);
    }
    if (state === "error") {
        console.log("Error state processed: activity = %s", activity);
    }

    // Note: 100 is graphically similar to 0
    return lookup[activity] || 100;
};

export default InstanceState;
