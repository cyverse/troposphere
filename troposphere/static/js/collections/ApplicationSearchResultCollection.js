define(
  [
    'collections/Base',
    'models/Application'
  ],
  function (Base, Application) {

    return Base.extend({
      model: Application,

      initialize: function (models, options) {
        if (options.query) this.query = options.query;
      },

      url: function () {
        return this.urlRoot + '/application/search?query=' + encodeURIComponent(this.query);
      }

    });

  });
