define(
  [
    'backbone',
    'underscore',
    'models/size',
    'globals'
  ],
  function (Backbone, _, Size, globals) {

    return Backbone.Collection.extend({
      model: Size,

      initialize: function(models, options) {
        this.creds = _.pick(options, 'provider_id', 'identity_id');
      },

      url: function () {
        var url = globals.API_ROOT +
                  "/provider/" + this.creds.provider_id +
                  "/identity/" + this.creds.identity_id +
                  "/size" + globals.slash();
        return url;
      }

    });

  });
