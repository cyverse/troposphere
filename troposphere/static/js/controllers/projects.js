define(['react', 'collections/projects', 'models/project', 'rsvp'], function(React, Collection, Model, RSVP) {

    var projects = new Collection();

    var getProjects = function() {
        return new RSVP.Promise(function(resolve, reject) {
            projects.fetch({
                success: resolve,
                error: reject
            });
        });
    };

    var createProject = function(name, description) {
        console.log(name, description);
        return new RSVP.Promise(function(resolve, reject) {
            var model = new Model();
            model.save({name: name, description: description}, {
                success: function(model) {
                    resolve(model);
                },
                error: function(model, response) {
                    reject(response);
                }
            });
        });
    };

    return {
        create: createProject,
        get: getProjects
    };
});
