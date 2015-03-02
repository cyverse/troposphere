define(
  [
    'backbone',
    'underscore',
    'globals',
    'context',
    './InstanceState'
  ],
  function (Backbone, _, globals, context, InstanceState) {

    return Backbone.Model.extend({

      urlRoot: globals.API_V2_ROOT + "/instances",

      parse: function (attributes) {
        attributes.start_date = new Date(attributes.start_date);
        attributes.state = new InstanceState({status_raw: attributes.status});
        return attributes;
      },

      getCreds: function () {
        return {
          provider_id: this.get('identity').provider,
          identity_id: this.get('identity').id
        };
      },

      computed: {

        shell_url: function () {
          var username = context.profile.get('username'),
              ip = this.get('ip_address'),
              location = ip.split(".").join("-");
          return "https://atmo-proxy.iplantcollaborative.org/?location=" + location + "&ssh=ssh://" + username + "@" + ip + ":22";
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
            'build - block_device_mapping',
            'build - scheduling',
            'build - spawning',
            'build - networking' ,
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
          if(instanceUrl.slice(-1) !== "/") instanceUrl += "/";
          return instanceUrl + 'action' + globals.slash();
        }
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
        if (!options.success) options.success = function () {
        };
        if (!options.error) options.error = function () {
        };

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

      reboot: function (options) {
        // Prevent user from being able to quickly resume multiple instances and go over quota
        this.set({status: 'active - rebooting'});
        this.performAction('reboot', options);
      },

      /*
       * Here, were override the get method to allow lazy-loading of computed
       * attributes
       */
      get: function (attr) {
        if (typeof this.computed !== "undefined" && typeof this.computed[attr] === 'function')
          return this.computed[attr].call(this);
        return Backbone.Model.prototype.get.call(this, attr);
      }
    });

  });
