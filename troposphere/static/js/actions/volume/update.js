import VolumeConstants from 'constants/VolumeConstants';
import Utils from '../Utils';

export default {
    update: function(volume, newAttributes) {
        if (!volume) throw new Error("Missing volume");
        if (!newAttributes || !newAttributes.name) throw new Error("Missing attributes.name");

        volume.set(newAttributes);

        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {
            volume: volume
        });

        volume.save({
            name: volume.get('name')
        }, {
            patch: true
        }).done(function() {
            // Nothing to do here
        }).fail(function(response) {
            Utils.displayError({
                title: "Volume could not be updated",
                response: response
            });
        }).always(function() {
            Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {
                volume: volume
            });
            Utils.dispatch(VolumeConstants.POLL_VOLUME, {
                volume: volume
            });
        });
    }
};
