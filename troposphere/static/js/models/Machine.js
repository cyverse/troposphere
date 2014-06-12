define(
  [
    'backbone',
    'globals'
  ],
  function (Backbone, globals) {

    return Backbone.Model.extend({

      parse: function (response) {
        response.id = response.alias;
        response.start_date = new Date(response.start_date);
        return response;
      },

      computed: {
        pretty_version: function () {
          var parts = this.get('version').split('.');
          for (var i = 0; i <= 3 - parts.length; i++) {
            parts.push("0");
          }
          return parts.join(".");
        }
      },

      /*
       * Here, were override the get method to allow lazy-loading of computed
       * attributes
       */
      get: function (attr) {
        if (typeof this.computed !== "undefined" && typeof this.computed[attr] === 'function') {
          return this.computed[attr].call(this);
        }
        return Backbone.Model.prototype.get.call(this, attr);
      }

    });

  });
