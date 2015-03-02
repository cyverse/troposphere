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

      url: globals.API_ROOT + '/instance_history',

      parse: function (response) {
        this.meta = {
          count: response.count,
          next: response.next,
          previous: response.previous
        };

        return response.results;
      },

      comparator: function (a, b) {
        return b.get('start_date').diff(a.get('start_date'), "seconds");
      }

    });

  });
