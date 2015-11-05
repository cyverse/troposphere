import Backbone from 'backbone';
import _ from 'underscore';
import Size from 'models/Size';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: Size,

    url: globals.API_V2_ROOT + "/sizes",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    },

    comparator: function (sizeA, sizeB) {
      var aliasA = parseInt(sizeA.get('alias'));
      var aliasB = parseInt(sizeB.get('alias'));

      if (aliasA === aliasB) return 0;
      return aliasA < aliasB ? -1 : 1;
    }

});
