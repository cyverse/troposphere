import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import globals from 'globals';
import context from 'context';
import InstanceState from './InstanceState';

export default Backbone.Model.extend({

      urlRoot: globals.API_V2_ROOT + "/instances",

      parse: function (attributes) {
        attributes.start_date = new Date(attributes.start_date);
        attributes.state = new InstanceState({status_raw: attributes.status});
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
          this.set('ip_address', attrs.ip_address);
          this.set('status', attrs.status);
          this.set('state', new InstanceState({status_raw: attrs.status}));
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

      destroy: function (options) {
        // We overwrite the destroy function so that the model doesn't get deleted while the instance is still 'terminating'

        options = options ? _.clone(options) : {};
        var model = this;
        var success = options.success;

        var self = this;
        options.success = function (resp) {
          if (success) {
            success(model, resp, options);

            // Get the new state from the data returned by API call
            self.set('status', resp.status);
          }

          if (!model.isNew())
            model.trigger('sync', model, resp, options);
        };

        // wrapError function from backbone.js
        var wrapError = function (model, options) {
          var error = options.error;
          options.error = function (resp) {
            if (error) error(model, resp, options);
            model.trigger('error', model, resp, options);
          };
        };

        if (this.isNew()) {
          options.success();
          return false;
        }

        wrapError(this, options);

        var xhr = this.sync('delete', this, options);
        return xhr;
      },

      performAction: function (action, options) {
        if (!options) options = {};
        if (!options.success) options.success = function () {};
        if (!options.error) options.error = function () {};

        $.ajax({
          url: this.get('action_url'),
          type: 'POST',
          data: JSON.stringify({
            action: action
          }),
          dataType: 'json',
          contentType: 'application/json',
          success: function (model) {
            options.success.apply(null, arguments);
          },
          error: function (response, status, error) {
            options.error.apply(null, arguments);
          }
        });
      },

      stop: function (options) {
        this.set({status: 'active - stopping'});
        this.performAction('stop', options);
      },

      start: function (options) {
        // Prevent user from being able to quickly start multiple instances and go over quota
        this.set({status: 'shutoff - powering-on'});
        options.error = function () {
          options.error();
          this.set({status: 'shutoff'});
        }.bind(this);
        this.performAction('start', options);
      },

      suspend: function (options) {
        this.set({status: 'active - suspending'});
        this.performAction('suspend', options);
      },

      resume: function (options) {
        // Prevent user from being able to quickly resume multiple instances and go over quota
        this.set({status: 'suspended - resuming'});
        this.performAction('resume', options);
      },

      redeploy: function (options) {
        this.set({status: 'active - initializing'});
        this.performAction('redeploying', options);
      },

      reboot: function (options) {
        this.set({status: 'active - rebooting'});
        this.performAction('reboot', options);
      },
});
