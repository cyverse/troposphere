/* volumes.js
 * Backbone.js volumes collection.
 */
define(
  [
    'backbone',
    'underscore',
    'globals',
    'models/Volume'
  ],
  function (Backbone, _, globals, Volume) {

    return Backbone.Collection.extend({
      model: Volume,

      initialize: function (models, options) {
        if (options && options.provider_id && options.identity_id)
          this.creds = _.pick(options, 'provider_id', 'identity_id');
        this.selected_volume = null;
      },

      url: function(){
        var creds = this.creds;
        var url = globals.API_ROOT +
                  '/provider/' + creds.provider_id +
                  '/identity/' + creds.identity_id +
                  '/volume' + globals.slash();
        return url;
      }

    });

  });
