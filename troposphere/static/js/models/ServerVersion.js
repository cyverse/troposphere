define(
  [
    'backbone',
    'globals'
  ],
  function (Backbone, globals) {

    return Backbone.Model.extend({
      url: globals.API_ROOT + "/version"
    });

  });
