define(['underscore', 'models/base'], function(_, Base) {

    /*
    {
        "occupancy": 0,
        "total": 1,
        "remaining": 1,
        "active": true,
        "alias": "1",
        "name": "tiny1",
        "provider": 4,
        "cpu": 1,
        "disk": 30,
        "root": 0,
        "mem": 4096
    }
    */

    var Size = Base.extend({
        defaults: { 'model_name': 'size' }
    });

    _.extend(Size.defaults, Base.defaults);

    return Size;

});
