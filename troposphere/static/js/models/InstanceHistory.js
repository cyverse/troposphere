import Backbone from 'backbone';
import moment from 'moment';

export default Backbone.Model.extend({

      getCreds: function () {
        return {
          provider_id: this.get('identity').provider,
          identity_id: this.get('identity').id
        };
      },

      parse: function (response) {
        var attributes = response;
        attributes.id = attributes.alias;
        attributes.start_date = moment(attributes.start_date);
        attributes.end_date = moment(attributes.end_date);
        return attributes;
      }
});
