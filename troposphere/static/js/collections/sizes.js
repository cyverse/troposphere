define(
  [
    'backbone',
    'models/size',
    'globals'
  ],
  function (Backbone, Size, globals) {

    return Backbone.Collection.extend({
      model: Size,

      url: function () {
        var url = globals.API_ROOT +
                  "/provider/" + this.get('provider_id') +
                  "/identity/" + this.get('identity_id') +
                  "/size" + globals.slash();
        return url;
      }

    });

  });
