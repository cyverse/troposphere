define(['models/instance', 'rsvp', 'controllers/notifications', 'underscore'],
function(Instance, RSVP, Notifications, _) {

    /*
     * models.Identity identity
     * string machineId
     * string sizeId
     * string instanceName
     */
    var launchInstance = function(identity, machineId, sizeId, instanceName) {
        return new RSVP.Promise(function(resolve, reject) {

            if (!instanceName || instanceName.length === 0) {
                reject(["Instance name is required"]);
                return;
            }

            var instance = new Instance({identity: identity});

            var params = {
                machine_alias: machineId,
                size_alias: sizeId,
                name: instanceName
            };

            instance.save(params, {
                success: function(model) {
                    Notifications.success("Instance Launched", "Your instance will be ready soon.");
                    resolve(model);
                },
                error: function(model, response, options) {
                    if (response.status < 500) {
                        var response = JSON.parse(reponse.responseText);
                        var messages = _.pluck(response.errors, 'message');
                        reject(messages);
                    } else {
                        reject();
                    }
                }
            });
        });
    };

    return {
        launch: launchInstance
    };

});
