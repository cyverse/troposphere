/* base.js
 * Backbone.js base collection functionality.
 */
define(['backbone', 'underscore'], function(Backbone, _) {

var Base = Backbone.Collection.extend({
    urlRoot: '/api/v1',
    url: function() {
        var creds = this.creds;
        return url = this.urlRoot
            + '/provider/' + creds.provider_id 
            + '/identity/' + creds.identity_id
            + '/' + this.model.prototype.defaults.model_name + '/';
    },
    defaults: {
        'api_url': '/api/v1',
        'model_name': 'base'
    }
});

return Base;

});
