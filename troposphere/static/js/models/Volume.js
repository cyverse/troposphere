define(function (require) {

  var Backbone = require('backbone'),
      globals = require('globals'),
      VolumeState = require('./VolumeState');

  return Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/volumes",

    parse: function (attributes) {
      attributes.start_date = new Date(attributes.start_date);
      attributes.state = new VolumeState({status_raw: attributes.status});
      attributes.status = attributes.status || "Unknown";

      if (attributes.attach_data && attributes.attach_data.instance_alias) {
        attributes.attach_data = {
          device: attributes.attach_data.device,
          instance_id: attributes.attach_data.instance_alias
        };
      }else{
        attributes.attach_data = {
          device: null,
          instance_id: null
        };
      }

      return attributes;
    },

    isAttached: function () {
      return this.get('status') == 'in-use' || this.get('status') == 'detaching';
    }

  });

});
