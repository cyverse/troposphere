define(
  [
    'underscore',
    'backbone',
    'globals',
    'models/machine',
    'collections/machines'
  ],
  function (_, Backbone, globals, Machine, Machines) {

    return Backbone.Model.extend({

      urlRoot: globals.API_ROOT + "/tag",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      }

    });

  });
