define(
  [
    'backbone',
    'underscore',
    'jquery',
    'globals',
    'context',
    './InstanceState'
  ],
  function (Backbone, _, $, globals, context, InstanceState) {

    return Backbone.Model.extend({

      urlRoot: globals.API_V2_ROOT + "/instances",

      initialize: function(){
        this.set('start_date', new Date(this.get('start_date')));
        this.set('end_date', new Date(this.get('end_date')));
      },

      parse: function (attributes) {
        attributes.start_date = new Date(attributes.start_date);
        attributes.state = new InstanceState({status_raw: attributes.status, status: attributes.status.split(" - ")[0], activity: attributes.activity});
        return attributes;
      },

      fetchFromCloud: function (cb) {
        var instanceId = this.get('uuid'),
          providerId = this.get('provider').uuid,
          identityId = this.get('identity').uuid;

        var url = (
          globals.API_ROOT +
          "/provider/" + providerId +
          "/identity/" + identityId +
          "/instance/" + instanceId
        );

        Backbone.sync("read", this, {
          url:url
        }).done(function(attrs, status, response){
          var statusSplit = attrs.status.split(' - ');
          this.set('ip_address', attrs.ip_address);
          this.set('status', attrs.status);
          this.set('state', new InstanceState({status_raw: attrs.status, status: statusSplit[0], activity: attrs.activity}));
          cb(response);
        }.bind(this)).fail(function(response, status, errorThrown){
          cb(response);
        });
      },

      createOnV1Endpoint: function (options, cb) {
        if (!options.name) throw new Error("Missing name");
        if (!options.size_alias) throw new Error("Missing size_alias");
        if (!options.machine_alias) throw new Error("Missing machine_alias");

        var providerId = this.get('provider').uuid,
            identityId = this.get('identity').uuid,
            name = options.name,
            size = options.size_alias,
            machine = options.machine_alias,
            scriptIDs = (options.scripts) ? options.scripts.map(function(script) {return script.id;}) : [];

        var url = (
          globals.API_ROOT +
          "/provider/" + providerId +
          "/identity/" + identityId +
          "/instance"
        );

        return Backbone.sync("create", this, {
          url: url,
          attrs: {
            name: name,
            machine_alias: machine,
            size_alias: size,
            scripts: scriptIDs
          }
        });
      },

      getCreds: function () {
        return {
          provider_id: this.get('identity').provider,
          identity_id: this.get('identity').id
        };
      },

      shell_url: function () {
        var username = context.profile.get('username'),
          ip = this.get('ip_address'),
          location = ip.split(".").join("-");
        return globals.WEB_SH_URL + "?location=" + location +
            "&ssh=ssh://" + username + "@" + ip + ":22";
      },

      vnc_url: function () {
        return "http://" + this.get('ip_address') + ":5904";
      },

      is_active: function () {
        var states = ['active', 'running', 'verify_resize'];
        return _.contains(states, this.get('status'));
      },

      is_build: function () {
        var states = [
          'build',
          'build - requesting_launch',
          'build - block_device_mapping',
          'build - scheduling',
          'build - spawning',
          'build - networking',
          'active - powering-off',
          'active - image_uploading',
          'shutoff - powering-on',
          'pending',
          'suspended - resuming',
          'active - suspending',
          'resize - resize_prep',
          'resize - resize_migrating',
          'resize - resize_migrated',
          'resize - resize_finish',
          'active - networking',
          'active - deploying',
          'active - initializing',
          'hard_reboot - rebooting_hard',
          'revert_resize - resize_reverting'
        ];
        return _.contains(states, this.get('status'));
      },

      is_delete: function () {
        var states = ['delete', 'active - deleting', 'deleted', 'shutting-down',
          'terminated'];
        return _.contains(states, this.get('status'));
      },

      is_inactive: function () {
        var states = ['suspended', 'shutoff', 'shutoff - powering-on'];
        return _.contains(states, this.get('status'));
      },

      is_resize: function () {
        return this.get('status').indexOf('resize') > -1;
      },

      action_url: function () {
        var instanceUrl = this.url();
        if (instanceUrl.slice(-1) !== "/") instanceUrl += "/";
        return instanceUrl + 'action';
      },

    });
});
