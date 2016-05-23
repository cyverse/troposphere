
var MockStore = function() {
    return {
        get: function() {
            return null;
        },

        getAll: function() {
            return null;
        },

        //
        // Inherited methods
        //

        addChangeListener: function(callback) {},
        removeChangeListener: function(callback) {},
        emitChange: function() {}
    }
};

export default MockStore;
