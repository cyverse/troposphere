/* base.js
 * Backbone.js base collection functionality.
 */
define(
  [
    'backbone',
    'underscore',
    'globals'
  ],
  function (Backbone, _, globals) {

    var Base = Backbone.Collection.extend({
      urlRoot: globals.API_ROOT,

      url: function () {
        var creds = this.creds;
        return url = this.urlRoot
          + '/provider/' + creds.provider_id
          + '/identity/' + creds.identity_id
          + '/' + this.model.prototype.defaults.model_name;
      },

      defaults: {
        'api_url': globals.API_ROOT,
        'model_name': 'base'
      }

    });

    return Base;

  });
