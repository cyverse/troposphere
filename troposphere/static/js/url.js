/* Module for generating in-app urls */
define(function() {

    var instance_url = function(instance) {
        var provider_id = instance.get('identity').provider;
        var identity_id = instance.get('identity').id;
        return 'provider/' + provider_id + '/identity/' + identity_id + '/instances/' + instance.id;
    };

    var volume_url = function(volume) {
        var provider_id = volume.get('identity').provider;
        var identity_id = volume.get('identity').id;
        return 'provider/' + provider_id + '/identity/' + identity_id + '/volumes/' + volume.id;
    };

    return {
        instance: instance_url,
        volume: volume_url
    };

});
