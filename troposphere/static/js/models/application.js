define(['underscore', 'models/base'], function(_, Base) {

    var Application = Base.extend({
        defaults: { 'model_name': 'application' },
        parse: function(response) {
            var attributes = response;
            attributes.id = response.uuid;
            attributes.rating = Math.floor(Math.random() * 6);
            attributes.favorite = Math.random() < 0.25;
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
        name_or_id: function() {
            return this.get('name') || this.get('id');
        }
    });

    _.extend(Application.defaults, Base.defaults);

    return Application;
});
