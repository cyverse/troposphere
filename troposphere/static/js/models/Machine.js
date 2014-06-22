define(
  [
    'backbone',
    'globals'
  ],
  function (Backbone, globals) {

    return Backbone.Model.extend({

      initialize: function (models, options) {
        if (options && options.provider_id && options.identity_id) {
          this.creds = _.pick(options, 'provider_id', 'identity_id');
        }
      },

      urlRoot: function () {
        var creds = this.creds;
        var url = globals.API_ROOT +
                  '/provider/' + creds.provider_id +
                  '/identity/' + creds.identity_id +
                  '/machine' + globals.slash();
        return url;
      },

      url: function(){
        return Backbone.Model.prototype.url.apply(this) + globals.slash();
      },

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
