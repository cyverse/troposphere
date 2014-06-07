define(
  [
    'models/Instance',
    'rsvp',
    'controllers/notifications',
    'underscore',
    'modal', 'controllers/notifications',
    'react',
    'components/common/Glyphicon.react'
  ],
  function (Instance, RSVP, Notifications, _, Modal, Notifications, React, Glyphicon) {

    /*
     * models.Identity identity
     * string machineId
     * string sizeId
     * string instanceName
     */
    var launchInstance = function (identity, machineId, sizeId, instanceName) {
      return new RSVP.Promise(function (resolve, reject) {

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
          success: function (model) {
            Notifications.success("Instance Launched", "Your instance will be ready soon.");
            resolve(model);
          },
          error: function (model, response, options) {
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

    var terminate = function (instance) {

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
        onConfirm: function () {
          return new RSVP.Promise(function (resolve, reject) {
            Notifications.info('Terminating Instance...', 'Please wait while your instance terminates.');

            instance.destroy({wait: true, success: resolve, error: reject});
          });
        },
        okButtonText: 'Yes, terminate this instance'
      });
    };

    var stop = function (instance) {
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
      var onConfirm = function () {
        return new RSVP.Promise(function (resolve, reject) {
          instance.stop({
            success: function (model) {
              Notifications.success('Stop Instance', 'Instance successfully stopped');
              resolve(model);
            },
            error: function (response) {
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

    var canLaunchInstance = function (instance) {
      // TODO: this
      return true;
    };

    var start = function (instance) {
      if (instance.get('state') === 'shutoff - powering-on') {
        Notifications.warning('Starting Instance', 'Please wait while your instance starts. Refresh "My Instances" to check its status.');
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
        onConfirm = function () {
          //Notifications.info('Starting Instance', 'Instance will be available momentarily.');

          return new RSVP.Promise(function (resolve, reject) {
            instance.start({
              success: function (model) {
                // Merges models to those that are accurate based on server response
                Notifications.success('Success', 'Instance successfully started');
                resolve(model);
              },
              error: function (response, status, error) {
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

    var suspend = function (instance) {
      if (instance.get('state') === 'active - suspending') {
        Notifications.warning('Suspending Instance', 'Please wait while your instance suspend. Refresh "My Instances" to check its status.');
        return;
      }

      var header = 'Suspend Instance';
      var body = [
        React.DOM.p({className: 'alert alert-warning'},
          Glyphicon({name: 'warning-sign'}),
          " ",
          React.DOM.strong({}, "WARNING"),
          " Suspending an instance will freeze its state, and the IP address may change when you resume the instance."),
        React.DOM.p({},
          'Suspending an instance frees up resources for other users and allows you to safely preserve the state of your instance without imaging. ',
          'Your time allocation no longer counts against you in the suspended mode.'),
        React.DOM.p({},
          'Your resource usage charts will only reflect the freed resources once the instance\'s state is "suspended."')
      ];

      var okButtonText = 'Suspend Instance';
      var onConfirm = function () {
        return new RSVP.Promise(function (resolve, reject) {
          instance.suspend({
            success: function (model) {
              Notifications.success("Success", "Your instance is now suspended");
              resolve(model);
            },
            error: function (response) {
              Notifications.error("Error", "You instance could not be suspended");
              reject(response);
            }
          });
        });
      };

      Modal.alert(header, body, {
        okButtonText: okButtonText,
        onConfirm: onConfirm
      });
    };

    var resume = function (instance) {
      if (instance.get('state') == 'suspended - resuming') {
        Notifications.warning('Resuming Instance', 'Please wait while your instance resumes. Refresh "My Instances" to check its status.');
        return;
      }

      var header = 'Resume Instance', body, okButtonText, onConfirm;

      // Make sure user has enough quota to resume this instance
      if (canLaunchInstance(instance)) {
        okButtonText = 'Resume Instance';
        body = 'Your instance\'s IP address may change once it resumes.';
        onConfirm = function () {
          return new RSVP.Promise(function (resolve, reject) {
            instance.resume({
              success: function (model) {
                Notifications.success('Success', 'Your instance is resuming');
                resolve(model);
              },
              error: function (response) {
                Notifications.danger('Error', 'You could not resume your instance');
                reject(response);
              }
            });
          });
        };
      } else {
        body = React.DOM.p({className: 'alert alert-error'},
          Glyphicon({name: 'ban-circle'}),
          " ",
          React.DOM.strong({}, "Cannot resume instance"),
          " You do not have enough resources to resume this instance. You must terminate, suspend, or stop another running instance, or request more resources.");
        okButtonText = 'Ok';
      }

      Modal.alert(header, body, {
        okButtonText: okButtonText,
        onConfirm: onConfirm
      });
    };

    return {
      launch: launchInstance,
      terminate: terminate,
      stop: stop,
      start: start,
      suspend: suspend,
      resume: resume
    };

  });
