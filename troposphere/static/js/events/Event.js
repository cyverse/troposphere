let Event = Model.extend({
    url: globals.API_V2_ROOT + "/events",
    validate: function(attrs, options) {
        throw "Events require validation, override validate";
    }
})
