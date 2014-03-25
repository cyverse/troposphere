define(['underscore', 'models/base'], function(_, Base) {

    var Machine = Base.extend({
        defaults: { 'model_name': 'machine' },
        parse: function(response) {
            response.id = response.alias;
            return response;
        }
    });

    _.extend(Machine.defaults, Base.defaults);

    return Machine;
});
