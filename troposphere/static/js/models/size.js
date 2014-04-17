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
        defaults: { 'model_name': 'size' },
        parse: function(attributes) {
            attributes.id = attributes.alias;
            return attributes;
        },
        formattedDetails: function() {
            var memoryGB = this.get('mem') / 1024;
            var parts = [this.get('cpu') + ' CPUs',
                         memoryGB + ' GB memory',
                         this.get('disk') + ' GB disk'];
            return this.get('name') + " (" + parts.join(', ') + ")";
        }
    });

    _.extend(Size.defaults, Base.defaults);

    return Size;

});
