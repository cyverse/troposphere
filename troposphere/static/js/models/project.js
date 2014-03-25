define(['models/base'], function(Base) {

    var Project = Base.extend({
        defaults: { 'model_name': 'project' }
    });

    return Project;

});
