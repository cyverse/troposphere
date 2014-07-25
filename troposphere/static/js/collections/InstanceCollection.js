/* instances.js
 * Backbone.js instances collection.
 */
define(
  [
    'backbone',
    'underscore',
    'globals',
    'models/Instance'
  ],
  function (Backbone, _, globals, Instance) {

    return Backbone.Collection.extend({
      model: Instance,

      initialize: function (models, options) {
        if (options && options.provider_id && options.identity_id) {
          this.creds = _.pick(options, 'provider_id', 'identity_id');
        }
        this.selected_instance = null;
      },

      url: function () {
        var creds = this.creds;
        var url = globals.API_ROOT +
                  '/provider/' + creds.provider_id +
                  '/identity/' + creds.identity_id +
                  '/instance' + globals.slash();
        return url;
      }

    });

  });
