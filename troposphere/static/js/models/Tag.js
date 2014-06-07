define(
  [
    'underscore',
    'backbone',
    'globals'
  ],
  function (_, Backbone, globals) {

    return Backbone.Model.extend({

      urlRoot: globals.API_ROOT + "/tag",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      }

    });

  });
