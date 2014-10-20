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
            current: 10,
            threshold: 1000
          }
        }

        return response;
      }

    });

  });
