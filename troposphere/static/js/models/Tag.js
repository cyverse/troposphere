define(
  [
    'underscore',
    'backbone',
    'globals'
  ],
  function (_, Backbone, globals) {

    return Backbone.Model.extend({

      urlRoot: globals.API_V2_ROOT + "/tags",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      }

    });

  });
