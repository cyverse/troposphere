define(['underscore', 'models/base', 'collections/instances',
'models/instance', 'collections/volumes', 'models/volume'], function(_, Base,
InstanceCollection, Instance, VolumeCollection, Volume) {

    var Project = Base.extend({
        defaults: { 'model_name': 'project' },
        parse: function(response) {
            response.start_date = new Date(response.start_date);
            response.instances = new InstanceCollection(_.map(response.instances, function(model) {
                return Instance.prototype.parse(model);
            }), {provider_id: null, identity_id: null});
            response.volumes = new VolumeCollection(_.map(response.volumes, function(model) {
                return Volume.prototype.parse(model);
            }), {provider_id: null, identity_id: null});
            return response;
        },
        url: function() {
            if (this.id)
                return this.urlRoot + '/project/' + this.id + '/';
            else
                return this.urlRoot + '/project/';
        },
        isEmpty: function() {
            return this.get('instances').isEmpty() && this.get('volumes').isEmpty();
        },
        canBeDeleted: function() {
            return this.get('name') !== 'Default';
        }
    });

    return Project;

});
