import Backbone from "backbone";

export default Backbone.Model.extend({
    initialize: function(attrs) {
        this.set("instances", attrs.instances || []);
        this.set("volumes", attrs.volumes || []);
    },

    isEmpty: function() {
        var instances = this.get("instances").filter(function(instance) {
            return instance.get("project") == null;
        });

        var volumes = this.get("volumes").filter(function(volume) {
            return volume.get("project") == null;
        });

        return instances.length === 0 && volumes.length === 0;
    }
});
