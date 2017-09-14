import Backbone from "backbone";
import globals from "globals";
import VolumeState from "./VolumeState";

let extractAttachData = function(attrs) {
    if (attrs.attach_data && attrs.attach_data.instance_alias) {
        return {
            device: attrs.attach_data.device,
            instance_id: attrs.attach_data.instance_alias
        };
    }

    return {
        device: null,
        instance_id: null
    };
};

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/volumes",

    parse: function(attributes) {
        if (attributes.name == null || attributes.name == "") {
            attributes.name = "<Unnamed Volume>";
        }
        if (attributes.start_date) {
            attributes.start_date = new Date(attributes.start_date);
        }
        if (attributes.status) {
            attributes.state = new VolumeState({
                status_raw: attributes.status
            });
        } else {
            attributes.status = "Unknown";
            attributes.state = new VolumeState({
                status_raw: "Unknown"
            });
        }
        attributes.attach_data = extractAttachData(attributes);
        return attributes;
    },

    isAttached: function() {
        return this.get("status") == "in-use" || this.get("status") == "detaching";
    },

    fetchFromCloud: function(cb) {
        var volumeId = this.get("uuid"),
            providerId = this.get("provider").uuid,
            identityId = this.get("identity").uuid;

        var url = (
        globals.API_ROOT +
            "/provider/" + providerId +
            "/identity/" + identityId +
            "/volume/" + volumeId
        );

        Backbone.sync("read", this, {
            url: url
        }).done(function(attrs, status, response) {
            this.set("status", attrs.status || "Unknown");
            this.set("state", new VolumeState({
                status_raw: attrs.status
            }));
            this.set("attach_data", extractAttachData(attrs));
            cb(response);
        }.bind(this));
    },

    create: function(options, cb) {
        if (!options.name)
            throw new Error("Missing name");
        if (!options.size)
            throw new Error("Missing size");
        if (!options.project)
            throw new Error("Missing project");
        if (options.snapshot_id && options.image_id) {
            throw new Error("Cannot pass 'image_id' and 'snapshot_id' to create.");
        }
        let identity = this.get("identity").uuid,
            name = options.name,
            size = options.size,
            project = options.project.get('uuid');

        let url = globals.API_V2_ROOT + "/volumes";
        let attrs = {
            name,
            size,
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
        if (!options.size)
            throw new Error("Missing size");

        var providerId = this.get("provider").uuid,
            identityId = this.get("identity").uuid,
            name = options.name,
            size = options.size;

        var url = (
        globals.API_ROOT +
            "/provider/" + providerId +
            "/identity/" + identityId +
            "/volume"
        );

        return Backbone.sync("create", this, {
            url: url,
            attrs: {
                name: name,
                size: size
            }
        });
    }
});
