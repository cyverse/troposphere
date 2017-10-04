import _ from "underscore";
import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/image_metrics",

    parse: function(attributes) {
        return attributes;
    },

    toJSON: function(options) {
        var attributes = _.clone(this.attributes);
        return attributes;
    },

    hasMetrics: function() {
        return this.attributes.metrics && Object.keys(this.attributes.metrics).length > 0;
    },

    getProjectsTotal: function() {
        let { projects } = this.attributes.metrics;
        return projects || 0;
    },

    getBookmarksTotal: function() {
        let { bookmarks } = this.attributes.metrics;
        return bookmarks || 0;
    },

    getApplicationForks: function() {
        let { forks } = this.attributes.metrics;
        return forks || 0;
    },

    getInstancesTotal: function() {
        let { instances } = this.attributes.metrics;
        return instances ? instances.total : 0;
    },

    getInstancesSuccess: function() {
        let { instances } = this.attributes.metrics;
        return instances ? instances.success : 0;
    },

    getInstancesPercent: function() {
        let { instances } = this.attributes.metrics;
        if (instances) {
            let percent = instances.percent;
            return (percent) ? percent.toFixed(3) : 0;
        } else {
            return 0;
        }
    }
});
