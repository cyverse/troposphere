define(['models/instance', 'rsvp', 'controllers/notifications', 'underscore',
'modal', 'controllers/notifications', 'react', 'components/common/glyphicon'],
function(Instance, RSVP, Notifications, _, Modal, Notifications, React,
Glyphicon) {

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

            var instance = new Instance({identity: {
                id: identity.id,
                provider: identity.get('provider_id')
            }});

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
                        var response = JSON.parse(response.responseText);
                        var messages = _.pluck(response.errors, 'message');
                        reject(messages);
                    } else {
                        reject();
                    }
                }
            });
        });
    };

    var terminate = function(instance) {

        var header = "Are you sure you want to terminate this instance?";
        var body = React.DOM.div({},
            React.DOM.p({className: 'alert alert-error'},
                Glyphicon({name: 'warning-sign'}),
                React.DOM.strong({}, 'WARNING'),
                ' Unmount volumes within your instance ',
                'before terminating or risk corrupting your data and the volume'),
            React.DOM.p({},
                'Your instance ',
                React.DOM.strong({}, 
                    instance.get('name'),
                    ' #', instance.get('id')),
                ' will be shut down and all data will be permanently lost!'),
            React.DOM.p({},
                React.DOM.em({}, "Note:"),
                ' Your resource usage charts will not relect changes until the ',
                'instance is completely terminated and has disappeared ',
                'from your list of instances.'));

        Modal.alert(header, body, {
            onConfirm : function() {
                return new RSVP.Promise(function(resolve, reject) {
                    Notifications.info('Terminating Instance...', 'Please wait while your instance terminates.');

                    instance.destroy({wait: true, success: resolve, error: reject});
                });
            },
            okButtonText: 'Yes, terminate this instance'
        });
    };

    return {
        launch: launchInstance,
        terminate: terminate
    };

});
