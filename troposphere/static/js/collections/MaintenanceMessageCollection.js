define(
  [
    'backbone',
    'models/MaintenanceMessage',
    'globals'
  ],
  function (Backbone, MaintenanceMessage, globals) {

    return Backbone.Collection.extend({
      model: MaintenanceMessage,

      url: function () {
        return globals.API_ROOT + "/maintenance" + globals.slash() + "?active=true";
      },

      comparator: function (a, b) {
        return b.get('start_date').diff(a.get('start_date'), "seconds");
      }

    });

  });
