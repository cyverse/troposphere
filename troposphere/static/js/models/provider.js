define(['underscore', 'models/base'], function(_, Base) {

    var Provider = Base.extend({
        defaults: { 'model_name': 'provider' },
        parse: function(response) {
            var attributes = response;
            attributes.name = attributes.location;
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
        isOpenStack: function() {
            return this.get('type').toLowerCase() === 'openstack';
        }
    });

    _.extend(Provider.defaults, Base.defaults);

    return Provider;
});
