define(
  [
    'backbone'
  ],
  function (Backbone) {

    return Backbone.Model.extend({
      url: "/version"
    });

  });
