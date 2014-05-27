define(
  [
    'backbone',
    'underscore',
    'globals',
    'models/instance'
  ],
  function (Backbone, _, globals, Instance) {

    return Backbone.Model.extend({

      urlRoot: function(){
        var creds = this.getCreds();
        var url = globals.API_ROOT +
                  '/provider/' + creds.provider_id +
                  '/identity/' + creds.identity_id +
                  '/volume' + globals.slash();
        return url;
      },

      url: function(){
        return Backbone.Model.prototype.url.apply(this) + globals.slash();
      },

      parse: function (response) {

        var attributes = _.pick(response, ['name', 'identity', 'status', 'size']);

        attributes.id = response.alias;
        attributes.start_date = new Date(response.start_date);

        attributes.attach_data = {
          attach_time: null,
          device: null,
          instance_id: null
        };

        if (!_.isEmpty(response.attach_data)) {
          attributes.attach_data = {
            attach_time: new Date(response.attach_data.attachTime),
            device: response.attach_data.device,
            instance_id: response.attach_data.instanceId
          };
        }

        return attributes;
      },

      getCreds: function () {
        return {
          provider_id: this.get('identity').provider,
          identity_id: this.get('identity').id
        };
      },

      computed: {
        name_or_id: function () {
          return this.get('name').length == 0 ? this.id : this.get('name');
        },
        isAttached: function () {
          return this.get('status') == 'in-use' || this.get('status') == 'detaching';
        }
      },

      attachTo: function (instance, mount_location, options) {
        if (!options) options = {};
        if (!options.success) options.success = function () {
        };
        if (!options.error) options.error = function () {
        };

        this.set({
          'status': 'attaching',
          'attach_data_instance_id': instance.get('id')
        });

        var param = {
          volume_id: this.get('id'),
          action: "attach_volume",
          mount_location: mount_location
        };

        var self = this;
        var instanceUrl = instance.url();
        if(instanceUrl.slice(-1) !== "/") instanceUrl += "/";
        var action_url = instanceUrl + 'action' + globals.slash();

        $.ajax({
          url: action_url,
          type: 'POST',
          data: param,
          success: function (response_text, textStatus, jqXHR) {
            self.set({
              'attach_data_attach_time': null,
              'attach_data_device': response_text.object.attach_data.device,
              'attach_data_instance_id': instance.get('id'),
              'status': 'in-use'
            });

            self.trigger('attach');
            options.success(response_text);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            self.set({
              'status': 'available',
              'attach_data_instance_id': null
            });

            options.error('failed to attach volume');
          }
        });
      },

      getAttachedInstance: function () {
        if (!this.isAttached())
          throw "Unattached volume";
        return new Instance({
          id: this.get('attach_data').instance_id,
          identity: this.get('identity')
        });
      },

      detach: function (options) {
        if (!options) options = {};
        if (!options.success) options.success = function () {
        };
        if (!options.error) options.error = function () {
        };

        var param = {
          volume_id: this.get('id'),
          action: "detach_volume"
        };
        var instance = this.getAttachedInstance();

        this.set({'status': 'detaching'});
        var self = this;
        var instanceUrl = instance.url();
        if(instanceUrl.slice(-1) !== "/") instanceUrl += "/";
        var action_url = instanceUrl + 'action' + globals.slash();

        $.ajax({
          url: action_url,
          type: "POST",
          data: param,
          success: function (response_data) {
            self.set({
              'attach_data': {},
              'status': 'available'
            });
            self.trigger('detach');
            options.success();
          },
          error: function (response_data) {
            options.error('failed to detach volume', response_data);
            self.set({'status': 'in-use'});
          }
        });
      },

      remove: function (options) {
        var values = {wait: true};
        _.defaults(values, options);
        this.destroy(values);
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
