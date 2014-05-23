define(['underscore', 'backbone', 'stores/collections/applications'], function(_, Backbone, Applications) {

    var CHANGE_EVENT = 'change';

    var _applications;

    var ApplicationStore = {
        getAll: function() {
            return _applications;
        },
        getFeatured: function() {
            return new Applications(_applications.filter(function(app) {
                return app.get('featured');
            }));
        },
        fetch: function() {
            apps = new Applications(); 
            apps.on('sync', function(coll) {
                _applications = coll;
                this.emitChange();
            }.bind(this));
            apps.fetch();
        },
        addChangeListener: function(callback) {
            this.on(CHANGE_EVENT, callback);
        },
        removeChangeListener: function(callback) {
            this.off(CHANGE_EVENT, callback);
        },
        emitChange: function() {
            this.trigger(CHANGE_EVENT);
        }
    };

    _.extend(ApplicationStore, Backbone.Events);

    return ApplicationStore;
});
