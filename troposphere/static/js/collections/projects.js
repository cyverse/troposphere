define(['collections/base', 'models/project'], function(Base, Project) {

    return Base.extend({
        model: Project,
        defaults: { 'model_name': 'project' },
        url: function() {
            return url = this.urlRoot
                + '/' + this.model.prototype.defaults.model_name + '/';
        },
        getFakeProjects: function() {
            var resp = [
                {
                    name: 'Unnamed Project',
                    id: 12
                }
            ];
            return resp;
        },
        sync: function(method, model, options) {
            /*
             * Here, we override the sync method until projects has a real API
             */
            console.log(method, model, options);
            if (method === 'read') {
                if (model.id === undefined) {
                    var resp = this.getFakeProjects();
                    if (options && options.success) {
                        options.success(resp);
                    }
                }
            }
        }
    });

});
