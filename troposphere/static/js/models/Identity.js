define(
  [
    'backbone'
  ],
  function (Backbone) {

    return Backbone.Model.extend({

      defaults: {
        // put default allocation data here since it isn't
        // in the data structure for admins (but we want it
        // in the object for consistency)
        quota: {
          allocation: {
            burn: null,
            current: null,
            delta: null,
            threshold: null,
            ttz: null
          }
        }
      },

      hasAllocation: function () {
        return (
          typeof this.attributes.quota.allocation != 'undefined'
        );
      }

    });

  });
