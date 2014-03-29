define(['underscore', 'models/base', 'collections/instances',
'models/instance', 'collections/volumes', 'models/volume'], function(_, Base,
InstanceCollection, Instance, VolumeCollection, Volume) {

    var Project = Base.extend({
        defaults: { 'model_name': 'project' },
        parse: function(response) {
            response.instances = new InstanceCollection(_.map(response.instances, function(model) {
                return Instance.prototype.parse(model);
            }), {provider_id: null, identity_id: null});
            response.volumes = new VolumeCollection(_.map(response.volumes, function(model) {
                return Volume.prototype.parse(model);
            }), {provider_id: null, identity_id: null});
            response.name = response.name === "default" ? "Unnamed Project" : response.name;
            return response;
        }
    });

    return Project;

});
