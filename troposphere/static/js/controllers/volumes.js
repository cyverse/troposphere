define(
  [
    'react',
    'controllers/notifications',
    'rsvp',
    'modal',
    'components/common/Glyphicon.react'
    // todo: Commenting out router is a quick fix to get the app to work. Trace where
    // it's used and add/modify code as needed to make the component behave as intended
    //'router'
  ],
  function (React, Notifications, RSVP, Modal, Glyphicon, router) {

    /*
     * models.volume volume,
     * models.instance instance,
     * sting (optional) mountLocation
     * Mount a volume to an instance at mountLocation
     * returns RSVP.Promise
     */
    var attachVolume = function (volume, instance, mountLocation) {
      return new RSVP.Promise(function (resolve, reject) {
        volume.attachTo(instance, mountLocation, {
          success: function (response_text) {
            var header = "Volume Successfully Attached";
            var body = 'You must <a href="https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step6%3AMountthefilesystemonthepartition." target="_blank">mount the volume</a> you before you can use it.<br />';
            body += 'If the volume is new, you will need to <a href="https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step5%3ACreatethefilesystem%28onetimeonly%29." target="_blank">create the file system</a> first.';

            Notifications.success(header, body, { no_timeout: true });
            resolve(response_text);
          },
          error: function (response_text) {
            var header = "Volume attachment failed.";
            var body = "If this problem persists, contact support at <a href=\"mailto:support@iplantcollaborative.org\">support@iplantcollaborative.org</a>"
            Notifications.danger(header, body, {
              no_timeout: true,
              type: 'error'
            });
            reject(response_text);
          }
        });
      });
    };

    /*
     * models.volume volume,
     */
    var detachVolume = function (volume, provider) {
      var header = React.DOM.span({},
        "Do you want to detach ",
        React.DOM.strong({}, volume.get('name_or_id')),
        "?");

      var body;
      if (provider.isOpenStack()) {
        body = [
          React.DOM.p({className: 'alert alert-danger'},
            Glyphicon({name: 'warning-sign'}),
            React.DOM.strong({}, 'WARNING '),
            "If this volume is mounted, you ",
            React.DOM.em({}, "must "),
            "stop any running processes that are writing to the mount location before you can detach."),
          React.DOM.p({},
            React.DOM.a({href: "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step7%3AUnmountanddetachthevolume.", target: "_blank"}, "Learn more about unmounting and detaching a volume"),
            "")
        ];
      } else {
        body = [
          React.DOM.p({className: 'alert alert-danger'},
            Glyphicon({name: 'warning-sign'}),
            React.DOM.strong({}, 'WARNING '),
            "If this volume is mounted, you ",
            React.DOM.em({}, "must "),
            "unmount it before detaching it."),
          React.DOM.p({},
            "If you detach a mounted volume, you run the risk of corrupting your data and the volume itself. (",
            React.DOM.a({href: "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step7%3AUnmountanddetachthevolume.", target: "_blank"}, "Learn more about unmounting and detaching a volume"),
            ")")
        ];
      }

      Modal.alert(header, body, {
        onConfirm: function () {
          return new RSVP.Promise(function (resolve, reject) {
            resolve();
            volume.detach({
              success: function () {
                Notifications.success("Volume Detached", "Volume is now available to attach to another instance or to destroy.");
              },
              error: function (message, response) {
                if (provider.isOpenStack()) {
                  var errors = $.parseJSON(response.responseText).errors;
                  var body = '<p class="alert alert-error">' + errors[0].message.replace(/\n/g, '<br />') + '</p>'
                  body += "<p>Please correct the problem and try again. If the problem persists, or you are unsure how to fix the problem, please email <a href=\"mailto:support@iplantcollaborative.org\">support@iplantcollaborative.org</a>.</p>"
                  Modal.alert("Volume failed to detach", body);
                } else {
                  Modal.alert("Volume failed to detach", "If the problem persists, please email <a href=\"mailto:support@iplantcollaborative.org\">support@iplantcollaborative.org</a>.");
                }
              }
            });
          });
        },
        okButtonText: 'Yes, detach this volume'
      });
    };

    /*
     * models.Volume volume
     */
    var destroyVolume = function (volume) {

      var volName = volume.get('name_or_id');
      var header = "Do you want to destroy this volume?";
      var body = React.DOM.div({},
        "Your volume ", React.DOM.strong({},volName), " will be destroyed and all data will be permanently lost!"
      );

      Modal.alert(header, body, {
        onConfirm: function () {
          return new RSVP.Promise(function (resolve, reject) {
            resolve();
            volume.remove({
              success: function () {
                Notifications.success("Success", "Volume destroyed");
                router.navigate('projects', {trigger: true});
              },
              error: function () {
                var header = "Something broke!";
                var body = 'You can refresh the page and try to perform this operation again. If the problem persists, please email '
                  + '<a href="mailto:support@iplantcollaborative.org">support@iplantcollaborative.org</a>. <br /><br />We apologize for the inconvenience.';
                Notifications.danger(header, body);
              }
            });
          });
        },
        okButtonText: 'Yes, destroy this volume'
      });

    };

    return {
      attach: attachVolume,
      detach: detachVolume,
      destroy: destroyVolume
    };
  });
