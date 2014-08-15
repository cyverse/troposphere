/* base.js
 * Backbone.js base model functionality.
 */

Atmo.Models.Base = Backbone.Model.extend({
	defaults: {
		'model_name': 'base'
	},
	urlRoot: Atmo.API_ROOT,
	url: function() {
		var creds = Atmo.get_credentials();
		var url = this.urlRoot
			+ '/provider/' + creds.provider_id 
			+ '/identity/' + creds.identity_id
			+ '/' + this.defaults.model_name;
		
		if (this.get('id') !== undefined) {
			url = url  + '/' + this.get('id');
		}

		return url;
	}
});

