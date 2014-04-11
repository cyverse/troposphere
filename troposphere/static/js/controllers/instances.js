define(['models/instance', 'rsvp'], function(Instance, RSVP) {

    /*
     * models.Identity identity
     * string machineId
     * string sizeId
     * string instanceName
     */
    var launchInstance = function(identity, machineId, sizeId, instanceName) {
        return new RSVP.Promise(function(resolve, reject) {

            if (!instanceName || instanceName.length === 0)
                reject("Instance name is required");

            var instance = new Instance({identity: identity});

            var params = {
                machine_alias: machineId,
                size_alias: sizeId,
                name: instanceName
            };

            instance.save(params, {
                success: function(model) {
                    resolve(model);
                },
                error: function(model, response, options) {
                    reject(response.responseText);
                }
            });
        });
    };

    return {
        launch: launchInstance
    };

});
