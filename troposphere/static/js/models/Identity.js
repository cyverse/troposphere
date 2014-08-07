define(
  [
    'backbone'
  ],
  function (Backbone) {

    return Backbone.Model.extend({

      parse: function(response){

        // put default allocation data here since it isn't
        // in the data structure for admins (but we want it
        // in the object for consistency)
        if(!response.quota.allocation){
          response.quota.allocation = {
            burn: null,
            current: null,
            delta: null,
            threshold: null,
            ttz: null
          }
        }

        return response;
      },

      hasAllocation: function () {
        return (
          typeof this.attributes.quota.allocation != 'undefined'
        );
      }

    });

  });
