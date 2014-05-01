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

    var stop = function(instance) {
        // If the instance is already starting/stopping inform user and return
        if (instance.get('state') === 'active - powering-off') {
            Notifications.warning('Stopping Instance', 'Please wait while your instance stops.');
            return;
        }

        var header = 'Stop Instance';
        var body = [
            React.DOM.p(""),
            React.DOM.p({}, React.DOM.strong({}, "NOTE:"), " This will NOT affect your resources. To preserve resources and time allocation you must suspend your instance.")
        ];
        var okButtonText = 'Stop Instance';
        var onConfirm = function() {
            return new RSVP.Promise(function(resolve, reject) {
                instance.stop({
                    success: function(model) {
                        Notifications.success('Stop Instance', 'Instance successfully stopped');
                        resolve(model);
                    },
                    error: function() {
                        Notifications.danger('Error', 'Could not stop instance');
                        reject(response);
                    }
                });
            });
        };

        Modal.alert(header, body, {
            onConfirm: onConfirm,
            okButtonText: okButtonText
        });
    };

    var canLaunchInstance = function(instance) {
        // TODO: this
        return true;
    };

    var start = function(instance) {
        if (instance.get('state') === 'shutoff - powering-on') {
            Notifications.warning('Starting Instance','Please wait while your instance starts. Refresh "My Instances" to check its status.');
            return;
        }

        // Make sure user has enough quota to resume this instance
        var header = 'Start Instance', body, okButtonText, onConfirm;
        if (canLaunchInstance(instance)) {
            body = [
                React.DOM.p({className: 'alert alert-warning'},
                    Glyphicon({name: 'warning-sign'}),
                    " ",
                    React.DOM.strong({}, 'WARNING'),
                    ' In order to start a stopped instance, you must have sufficient quota and the cloud must have enough room to support your instance\'s size.')
            ];
            okButtonText = 'Start Instance';
            onConfirm = function() {
                //Notifications.info('Starting Instance', 'Instance will be available momentarily.');

                // Prevent user from being able to quickly start multiple instances and go over quota
                instance.set({state: 'shutoff - powering-on'});

                return new RSVP.Promise(function(resolve, reject) {
                    instance.start({
                        success: function(model) {
                            // Merges models to those that are accurate based on server response
                            // Atmo.instances.update();
                            Notifications.success('Success', 'Instance successfully started');
                            resolve(model);
                        },
                        error: function(response, status, error) {
                            instance.set({state: 'shutoff'});
                            Notifications.danger('Error', 'Could not start instance');
                            reject(response);
                        }
                    });
                });
            };
        } else {
            body = React.DOM.p({className: 'alert alert-danger'},
                Glyphicon({name: 'ban-circle'}),
                " ",
                React.DOM.strong({}, "Cannot start Instance"),
                " You do not have enough resources to start this instance. You must terminate, suspend, or stop another running instance, or request more resources.");
            okButtonText = 'Ok';
        }

        Modal.alert(header, body, {
            onConfirm: onConfirm,
            okButtonText: okButtonText
        });
    };

    return {
        launch: launchInstance,
        terminate: terminate,
        stop: stop,
        start: start
    };

});
