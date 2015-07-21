define(function (require) {

  var Backbone = require('backbone'),
    globals = require('globals'),
    VolumeState = require('./VolumeState');

  var extractAttachData = function (attrs) {
    if (attrs.attach_data && attrs.attach_data.instance_alias) {
      return {
        device: attrs.attach_data.device,
        instance_id: attrs.attach_data.instance_alias
      };
    }

    return {
      device: null,
      instance_id: null
    };
  };

  return Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/volumes",

    parse: function (attributes) {
      attributes.start_date = new Date(attributes.start_date);
      attributes.state = new VolumeState({status_raw: attributes.status});
      attributes.status = attributes.status || "Unknown";
      attributes.attach_data = extractAttachData(attributes);
      return attributes;
    },

    isAttached: function () {
      return this.get('status') == 'in-use' || this.get('status') == 'detaching';
    },

    fetchFromCloud: function (cb) {
      var volumeId = this.get('uuid'),
        providerId = this.get('provider').uuid,
        identityId = this.get('identity').uuid;

      var url = (
        globals.API_ROOT +
        "/provider/" + providerId +
        "/identity/" + identityId +
        "/volume/" + volumeId
      );

      Backbone.sync("read", this, {
        url: url
      }).done(function (attrs, status, response) {
        this.set('status', attrs.status || "Unknown");
        this.set('state', new VolumeState({status_raw: attrs.status}));
        this.set('attach_data', extractAttachData(attrs));
        cb();
      }.bind(this));
    },

    createOnV1Endpoint: function (options, cb) {
      if (!options.name) throw new Error("Missing name");
      if (!options.size) throw new Error("Missing size");

      var volumeId = this.get('uuid'),
        providerId = this.get('provider').uuid,
        identityId = this.get('identity').uuid,
        name = options.name,
        size = options.size;

      var url = (
        globals.API_ROOT +
        "/provider/" + providerId +
        "/identity/" + identityId +
        "/volume"
      );

      return Backbone.sync("create", this, {
        url: url,
        attrs: {
          name: name,
          size: size
        }
      });
      //.done(function(attrs, status, response){
      //  cb(null, attrs);
      //}.bind(this)).fail(function(response){
      //  cb(response);
      //});
    }

  });

});
