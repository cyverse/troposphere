/* instances.js
 * Backbone.js instances collection.
 */
define(
  [
    './InstanceCollection',
    'models/InstanceHistory',
    'globals'
  ],
  function (InstanceCollection, InstanceHistory, globals) {

    return InstanceCollection.extend({
      model: InstanceHistory,

      url: function () {
        var url = globals.API_ROOT +
                  '/provider/' + this.creds.provider_id +
                  '/identity/' + this.creds.identity_id +
                  '/instance/history' + globals.slash();
        return url;
      },

      parse: function (response) {
        this.meta = {
          count: response.count,
          next: response.next,
          previous: response.previous
        };

        return response.results;
      },

      comparator: function (a, b) {
        return a.start_date > b.start_date;
      }

    });

  });
