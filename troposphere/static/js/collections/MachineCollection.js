define(
  [
    'backbone',
    'underscore',
    'globals',
    'models/Machine'
  ],
  function (Backbone, _, globals, Machine) {

    return Backbone.Collection.extend({
      model: Machine,

      initialize: function (models, options) {
        if (options && options.provider_id && options.identity_id) {
          this.creds = _.pick(options, 'provider_id', 'identity_id');
        }
      },

      url: function () {
        var creds = this.creds;
        var url = globals.API_ROOT +
                  '/provider/' + creds.provider_id +
                  '/identity/' + creds.identity_id +
                  '/machine' + globals.slash();
        return url;
      }

    });

  });
