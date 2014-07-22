define(
  [
    'backbone',
    'underscore',
    'globals',
    'context'
  ],
  function (Backbone, _, globals, context) {

    return Backbone.Model.extend({

      getCreds: function () {
        return {
          provider_id: this.get('identity').provider,
          identity_id: this.get('identity').id
        };
      }

    });

  });
