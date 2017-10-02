import Backbone from "backbone";
import _ from "underscore";
import globals from "globals";
import context from "context";
import InstanceState from "./InstanceState";

export default Backbone.Model.extend({

    initialize: function() {
        if (this.get("start_date")) {
            this.set("start_date", new Date(this.get("start_date")));
        }
        if (this.get("end_date")) {
            this.set("end_date", new Date(this.get("end_date")));
        }
    },

    parse: function(attributes) {
        if (attributes.name == null || attributes.name == "") {
            attributes.name = "<Unnamed Instance>";
        }
        attributes.start_date = new Date(attributes.start_date);
        if(attributes.end_date != null && attributes.end_date != "") {
            attributes.end_date = new Date(attributes.end_date);
        }
        attributes.state = new InstanceState({
            status_raw: attributes.status,
            status: attributes.status.split(" - ")[0],
            activity: attributes.activity
        });
        return attributes;
    },

    fetchFromCloud: function(cb) {
        var instanceId = this.get("uuid"),
            providerId = this.get("provider").uuid,
            identityId = this.get("identity").uuid;

        var url = (
        globals.API_ROOT +
            "/provider/" + providerId +
            "/identity/" + identityId +
            "/instance/" + instanceId
        );

        Backbone.sync("read", this, {
            url: url
        }).done(function(attrs, status, response) {
            // set attributes that need to be updated
            // following a poll, "from cloud" will be latest
            var statusSplit = attrs.status.split(" - ");
            this.set("ip_address", attrs.ip_address);
            this.set("status", attrs.status);
            this.set("state", new InstanceState({
                status_raw: attrs.status,
                status: statusSplit[0],
                activity: attrs.activity
            }));
            this.set("web_desktop", attrs.web_desktop);
            this.set("vnc", attrs.has_vnc);
            cb(response);
        }.bind(this)).fail(function(response, status, errorThrown) {
            cb(response);
        });
    },

    create: function(options, cb) {
        if (!options.name)
            throw new Error("Missing name");
        if (!options.size_alias)
            throw new Error("Missing size_alias");
        if (!options.source_alias)
            throw new Error("Missing source_alias");
        if (!options.project)
            throw new Error("Missing project");

        if (globals.USE_ALLOCATION_SOURCES) {
            if (!options.allocation_source_id) {
                throw new Error("Missing allocation_source_id");
            }
        }

        let identity = this.get("identity").uuid,
            name = options.name,
            size = options.size_alias,
            source = options.source_alias,
            project = options.project.get('uuid'),
            allocation_source_id = options.allocation_source_id,
            scripts = (options.scripts) ? options.scripts.map(function(script) {
                return script.get('uuid');
            }) : [];

        var url = (
        globals.API_V2_ROOT + "/instances");

        let attrs = {
            source_alias: source,
            size_alias: size,
            allocation_source_id,
            name,
            scripts,
            project,
            identity
        }

        return Backbone.sync("create", this, {
            url,
            attrs
        });
    },

    createOnV1Endpoint: function(options, cb) {
        if (!options.name)
            throw new Error("Missing name");
        if (!options.size_alias)
            throw new Error("Missing size_alias");
        if (!options.machine_alias)
            throw new Error("Missing machine_alias");

        if (globals.USE_ALLOCATION_SOURCES) {
            if (!options.allocation_source_uuid) {
                throw new Error("Missing allocation_source_uuid");
            }
        }

        var providerId = this.get("provider").uuid,
            identityId = this.get("identity").uuid,
            name = options.name,
            size = options.size_alias,
            machine = options.machine_alias,
            scriptIDs = (options.scripts) ? options.scripts.map(function(script) {
                return script.id;
            }) : [];

        var url = (
        globals.API_ROOT +
            "/provider/" + providerId +
            "/identity/" + identityId +
            "/instance"
        );

        let attrs = {
            name: name,
            machine_alias: machine,
            size_alias: size,
            scripts: scriptIDs
        }

        if (globals.USE_ALLOCATION_SOURCES) {
            attrs.allocation_source_uuid = options.allocation_source_uuid;
        }

        return Backbone.sync("create", this, {
            url,
            attrs
        });
    },

    getCreds: function() {
        return {
            provider_id: this.get("identity").provider,
            identity_id: this.get("identity").id
        };
    },

    shell_url: function() {
        var username = context.profile.get("username"),
            ip = this.get("ip_address"),
            location = ip.split(".").join("-");
        return globals.WEB_SH_URL + "?location=" + location +
        "&ssh=ssh://" + username + "@" + ip + ":22";
    },

    vnc_url: function() {
        return "http://" + this.get("ip_address") + ":5904";
    },

    is_active: function() {
        var states = ["active", "running", "verify_resize"];
        return _.contains(states, this.get("status"));
    },

    is_build: function() {
        var states = [
            "build",
            "build - requesting_launch",
            "build - block_device_mapping",
            "build - scheduling",
            "build - spawning",
            "build - networking",
            "active - powering-off",
            "active - image_uploading",
            "shutoff - powering-on",
            "pending",
            "suspended - resuming",
            "active - suspending",
            "resize - resize_prep",
            "resize - resize_migrating",
            "resize - resize_migrated",
            "resize - resize_finish",
            "active - networking",
            "active - deploying",
            "active - initializing",
            "active - shelving",
            "active - shelving_image_pending_upload",
            "active - shelving_image_uploading",
            "hard_reboot - rebooting_hard",
            "revert_resize - resize_reverting"
        ];
        return _.contains(states, this.get("status"));
    },

    is_delete: function() {
        var states = ["delete", "active - deleting", "deleted", "shutting-down",
            "terminated"];
        return _.contains(states, this.get("status"));
    },

    is_inactive: function() {
        var states = [
            "suspended",
            "shutoff",
            "shutoff - powering-on",
            "shelved",
            "shelved_offloaded"
        ];
        return _.contains(states, this.get("status"));
    },

    is_resize: function() {
        return this.get("status").indexOf("resize") > -1;
    },

    action_url: function() {
        var instanceUrl = this.url();
        if (instanceUrl.slice(-1) !== "/")
            instanceUrl += "/";
        return instanceUrl + "action";
    }
});
