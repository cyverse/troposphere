define(['notifications', 'rsvp'], function(Notifications, RSVP) {

    /*
     * models.volume volume, 
     * models.instance instance,
     * sting (optional) mountLocation 
     * Mount a volume to an instance at mountLocation
     * returns RSVP.Promise
     */
    var attachVolume = function(volume, instance, mountLocation) {
        console.log("instance to attach to", instance);
        return new RSVP.Promise(function(resolve, reject) {
            volume.attachTo(instance, mountLocation, {
                success: function(response_text) {
                    var header = "Volume Successfully Attached";
                    var body = 'You must <a href="https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step6%3AMountthefilesystemonthepartition." target="_blank">mount the volume</a> you before you can use it.<br />';
                    body += 'If the volume is new, you will need to <a href="https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step5%3ACreatethefilesystem%28onetimeonly%29." target="_blank">create the file system</a> first.';

                    console.log("success response text", response_text);

                    Notifications.notify(header, body, { no_timeout: true });
                    resolve(response_text);
                },
                error: function(response_text) {
                    var header = "Volume attachment failed.";
                    var body = "If this problem persists, contact support at <a href=\"mailto:support@iplantcollaborative.org\">support@iplantcollaborative.org</a>"
                    Notifications.notify(header, body, {
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
     * models.instance instance,
     * returns RSVP.Promise
     */
    var detachVolume = function(volume) {
        var header = "Do you want to detach <strong>"+volume.get('name_or_id')+'</strong>?';
        var identity_id = Atmo.profile.get('selected_identity').id;
        var identity = Atmo.identities.get(identity_id);
        var provider_name = identity.get('provider').get('type');
        var body;
        if (provider_name.toLowerCase() === 'openstack') {
            body = '<p class="alert alert-error"><i class="glyphicon glyphicon-warning-sign"></i> <strong>WARNING</strong> If this volume is mounted, you <u>must</u> stop any running processes that are writing to the mount location before you can detach.</p>'; 
            body += '<p>(<a href="https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step7%3AUnmountanddetachthevolume." target="_blank">Learn more about unmounting and detaching a volume</a>)</p>';
        } else {
            body = '<p class="alert alert-error"><i class="glyphicon glyphicon-warning-sign"></i> <strong>WARNING</strong> If this volume is mounted, you <u>must</u> unmount it before detaching it.</p>'; 
            body += '<p>If you detach a mounted volume, you run the risk of corrupting your data and the volume itself. (<a href="https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step7%3AUnmountanddetachthevolume." target="_blank">Learn more about unmounting and detaching a volume</a>)</p>';
        }

        Utils.confirm(header, body, { 
            on_confirm: function() {
                volume.detach(instance, {
                    success: function() {
                        Utils.notify("Volume Detached", "Volume is now available to attach to another instance or to destroy.");
                        if (options.success)
                            options.success();
                    },
                    error: function(message, response) {
                        if (provider_name.toLowerCase() === 'openstack') {
                            errors = $.parseJSON(response.responseText).errors
                            var body = '<p class="alert alert-error">' + errors[0].message.replace(/\n/g, '<br />') + '</p>'
                            body += "<p>Please correct the problem and try again. If the problem persists, or you are unsure how to fix the problem, please email <a href=\"mailto:support@iplantcollaborative.org\">support@iplantcollaborative.org</a>.</p>"
                            Utils.confirm("Volume failed to detach", body, {
                                //TODO: Remove the 'Cancel' button on this box
                            });
                        } else {
                            Utils.notify("Volume failed to detach", "If the problem persists, please email <a href=\"mailto:support@iplantcollaborative.org\">support@iplantcollaborative.org</a>.", {no_timeout: true});
                        }
                    }
                }); 
            },
            on_cancel: function() {
                console.log("cancelled volume detach.");
                Atmo.volumes.fetch();
            },
            ok_button: 'Yes, detach this volume'
        });
    };

    return {
        attachVolume: attachVolume,
        detachVolume: detachVolume
    };
});
