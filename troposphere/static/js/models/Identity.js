import Backbone from "backbone";
import featureFlags from "utilities/featureFlags";
import globals from "globals";

function isRelevant(model, identityId) {
    // using double ~ to convert string to number
    return model.id && model.get("identity") &&
    ~~model.get("identity").id === identityId;

}

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/identities",
    parse: function(attributes) {

        // put default allocation data here since it isn't
        // in the data structure for admins (but we want it
        // in the object for consistency)
        if (!attributes.allocation) {
            attributes.allocation = {
                current: 10,
                threshold: 168
            }
        }

        // todo: put this in the API
        if (attributes.allocation.current === null || attributes.allocation.current === undefined) {
            attributes.allocation.current = 777;
        }

        return attributes;
    },

    getInstancesConsumingAllocation: function(instances) {
        var identityId = this.id;

        return instances.filter(function(instance) {
            if (isRelevant(instance, identityId)) {
                return instance.get("status") === "active";
            } else {
                return false;
            }
        });
    },

    getName: function() {
        let provider = this.get('provider');
        if (!featureFlags.hasProjectSharing()) {
                return provider.name;
        }
        return this.get("key") + " on " + provider.name;
    },
    toString: function() {
        let verboseText = this.getCredentialValue('key')
            + "/" + this.getCredentialValue('ex_project_name')
            + " on " + this.get("provider").name;

        return verboseText;
    },
    getCredentialValue: function(key_name) {
        let credentials = this.get('credentials');
        let filtered = credentials.filter(function(cred) { return cred.key == key_name; });
        return filtered.length != 0 ? filtered[0].clean_value : "";
    },

    getCpusUsed: function(instances, sizes) {
        var identityId = this.id;

        return instances.reduce(function(total, instance) {
            if (isRelevant(instance, identityId)) {
                var size = sizes.get(instance.get("size").id),
                    cpuCount = size ? size.get("cpu") : 0;
                return total + cpuCount;
            } else {
                return total;
            }
        }, 0);
    },

    getMemoryUsed: function(instances, sizes) {
        var identityId = this.id;

        return instances.reduce(function(total, instance) {
            if (isRelevant(instance, identityId)) {
                var size = sizes.get(instance.get("size").id),
                    memConsumed = size ? size.get("mem") : 0;
                return total + memConsumed;
            } else {
                return total;
            }
        }, 0);
    },

    getStorageUsed: function(volumes) {
        var identityId = this.id;

        return volumes.reduce(function(total, volume) {
            if (isRelevant(volume, identityId)) {
                var size = volume.get("size") || 0;
                return total + size;
            } else {
                return total;
            }
        }, 0);
    },

    getStorageCountUsed: function(volumes) {
        var identityId = this.id;

        return volumes.reduce(function(total, volume) {
            if (isRelevant(volume, identityId)) {
                return total + 1;
            } else {
                return total;
            }
        }, 0);
    }
});
