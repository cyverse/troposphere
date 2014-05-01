define(['react', 'collections/projects', 'models/project', 'rsvp', 'controllers/notifications'], function(React, Collection, Model, RSVP, Notifications) {

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
                    Notifications.success('Success', 'Created new project "' + model.get('name') + '"');
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
