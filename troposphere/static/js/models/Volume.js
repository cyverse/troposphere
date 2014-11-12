define(
  [
    'backbone',
    'underscore',
    'globals',
    'models/Instance',
    './VolumeState'
  ],
  function (Backbone, _, globals, Instance, VolumeState) {

    return Backbone.Model.extend({

      urlRoot: function(){
        var creds = this.getCreds();
        var url = globals.API_ROOT +
                  '/provider/' + creds.provider_id +
                  '/identity/' + creds.identity_id +
                  '/volume';
        return url;
      },

      url: function(){
        return Backbone.Model.prototype.url.apply(this) + globals.slash();
      },

      parse: function (response) {

        var attributes = response;

        attributes.id = attributes.alias;
        attributes.start_date = new Date(attributes.start_date);
        attributes.state = new VolumeState({status_raw: attributes.status});

        if (response.attach_data && response.attach_data.instance_alias) {
          attributes.attach_data = {
            device: response.attach_data.device,
            instance_id: response.attach_data.instance_alias
          };
        }else{
          attributes.attach_data = {
            device: null,
            instance_id: null
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

      isAttached: function () {
        return this.get('status') == 'in-use' || this.get('status') == 'detaching';
      },

      attachTo: function (instance, mount_location, options) {
        if (!options) options = {};
        if (!options.success) options.success = function () {
        };
        if (!options.error) options.error = function () {
        };

        this.set({
          'status': 'attaching'
        });

        this.get('attach_data').instance_id = instance.get('id');

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
          data: JSON.stringify(param),
          dataType: "json",
          contentType: 'application/json',
          success: function (response_text, textStatus, jqXHR) {
            var attachData = {
              attach_time: null,
              device: response_text.object.attach_data.device,
              instance_id: instance.get('id')
            };

            self.set({
              'status': 'in-use',
              attach_data: attachData
            });

            self.trigger('attach');
            options.success(response_text);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            self.set({
              'status': 'available'
            });
            self.get('attach_data').instance_id = null;

            options.error(jqXHR.responseJSON);
          }
        });
      },

      getAttachedInstance: function () {
        if (!this.isAttached()) throw "Unattached volume";
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
          type: 'POST',
          data: JSON.stringify(param),
          dataType: 'json',
          contentType: 'application/json',
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
      }

    });

  });
