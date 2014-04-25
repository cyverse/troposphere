define(['underscore', 'models/base', 'models/machine', 'collections/machines'],
function(_, Base, Machine, Machines) {

    var Application = Base.extend({
        defaults: { 'model_name': 'application' },
        parse: function(response) {
            var attributes = response;
            attributes.id = response.uuid;
            attributes.rating = Math.floor(Math.random() * 6);
            attributes.favorite = response.is_bookmarked;
            var machines = _.map(attributes.machines, function(attrs) {
                return new Machine(Machine.prototype.parse(attrs));
            });
            attributes.machines = new Machines(machines);
            return attributes;
        },
        url: function(){
            var url = this.urlRoot
                + '/' + this.defaults.model_name + '/';
            
            if (typeof this.get('id') != 'undefined') {
                url += this.get('id') + '/';
            }
            
            return url;
        },
        computed: {
            name_or_id: function() {
                return this.get('name') || this.get('id');
            }
        }
    });

    _.extend(Application.defaults, Base.defaults);

    return Application;
});
