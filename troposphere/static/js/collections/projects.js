define(['collections/base', 'models/project'], function(Base, Project) {

    return Base.extend({
        model: Project,
        defaults: { 'model_name': 'project' },
        url: function() {
            return url = this.urlRoot
                + '/' + this.model.prototype.defaults.model_name + '/';
        }
    });

});
