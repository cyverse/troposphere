define(
  [
    'underscore',
    'backbone',
    'collections/InstanceCollection',
    'models/instance',
    'collections/volumes',
    'models/volume',
    'globals'
  ],
  function (_, Backbone, InstanceCollection, Instance, VolumeCollection, Volume, globals) {

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

    var Project = Backbone.Model.extend({

      urlRoot: globals.API_ROOT + "/project",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      defaults: {
        name: 'No name provided',
        description: 'No description provided'
      },

      initialize: function(options){
        //this.set('instances', new InstanceCollection());
        //this.set('volumes', new VolumeCollection());
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

      isEmpty: function () {
        var instances = this.get('instances');
        var volumes = this.get('volumes');
        var hasNoInstances = instances ? instances.isEmpty() : true;
        var hasNoVolumes = volumes ? volumes.isEmpty() : true;

        return hasNoInstances && hasNoVolumes;
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
