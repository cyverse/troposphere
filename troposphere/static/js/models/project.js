define(
  [
    'underscore',
    'models/base',
    'collections/instances',
    'models/instance',
    'collections/volumes',
    'models/volume'
  ],
  function (_, Base, InstanceCollection, Instance, VolumeCollection, Volume) {

    var statics = {
      objectType: function (model) {
        var objectType;
        if (model instanceof Instance)
          objectType = 'instance';
        else if (model instanceof Volume)
          objectType = 'volume';
        else
          throw "Unknown model type";
        return objectType;
      }
    };

    var Project = Base.extend({
      defaults: { 'model_name': 'project' },

      initialize: function (attributes) {
        _.each(['instances', 'volumes'], function (attr) {
          this.get(attr).on('all', function () {
            this.trigger('change', this, this.get(attr));
          }.bind(this));
        }.bind(this));
      },

      parse: function (response) {
        response.start_date = new Date(response.start_date);
        response.instances = new InstanceCollection(_.map(response.instances, function (model) {
          return Instance.prototype.parse(model);
        }), {provider_id: null, identity_id: null});
        response.volumes = new VolumeCollection(_.map(response.volumes, function (model) {
          return Volume.prototype.parse(model);
        }), {provider_id: null, identity_id: null});
        return response;
      },

      url: function () {
        if (this.id)
          return this.urlRoot + '/project/' + this.id;
        else
          return this.urlRoot + '/project/';
      },

      isEmpty: function () {
        return this.get('instances').isEmpty() && this.get('volumes').isEmpty();
      },

      canBeDeleted: function () {
        return this.get('name') !== 'Default';
      },

      objectUrl: function (model) {
        var objectType = Project.objectType(model);
        return this.url() + objectType + '/' + model.id + '/';
      },

      putItem: function (model, options) {
        var url = this.objectUrl(model);
        $.ajax({
          dataType: 'json',
          contentType: 'application/json',
          url: url,
          type: 'PUT'
        });
        // this is so bad. Sorry
        this.get(Project.objectType(model) + 's').add(model);
      },

      removeItem: function (model, options) {
        var url = this.objectUrl(model);
        $.ajax({
          dataType: 'json',
          contentType: 'application/json',
          url: url,
          type: 'DELETE'
        });
        // this is so bad. Sorry
        this.get(Project.objectType(model) + 's').remove(model);
      }

    }, statics);

    return Project;

  });
