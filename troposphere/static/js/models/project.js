define(['underscore', 'models/base', 'collections/instances', 'models/instance'], function(_, Base, InstanceCollection, Instance) {

    var Project = Base.extend({
        defaults: { 'model_name': 'project' },
        parse: function(response) {
            response.instances = new InstanceCollection(_.map(response.instances, function(model) {
                return Instance.prototype.parse(model);
            }), {provider_id: null, identity_id: null});
            return response;
        }
    });

    return Project;

});
