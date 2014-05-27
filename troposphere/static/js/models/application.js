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

      defaults: { 'model_name': 'application' },

      urlRoot: globals.API_ROOT + "/application",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      parse: function (response) {
        var attributes = response;
        attributes.id = response.uuid;
        attributes.rating = Math.floor(Math.random() * 6);
        attributes.favorite = response.is_bookmarked;
        var machines = _.map(attributes.machines, function (attrs) {
          return new Machine(Machine.prototype.parse(attrs));
        });
        attributes.machines = new Machines(machines);
        return attributes;
      },

      computed: {
        name_or_id: function () {
          return this.get('name') || this.get('id');
        }
      },

      /*
       * Here, were override the get method to allow lazy-loading of computed
       * attributes
       */
      get: function (attr) {
        if (typeof this.computed !== "undefined" && typeof this.computed[attr] === 'function')
          return this.computed[attr].call(this);
        return Backbone.Model.prototype.get.call(this, attr);
      }

    });

  });
