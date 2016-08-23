
import VolumeConstants from 'constants/VolumeConstants';
import Utils from '../Utils';

export default {

    poll: function(params) {
        var volume = params.volume;
        if (!volume) throw new Error("Missing volume");
        Utils.dispatch(VolumeConstants.POLL_VOLUME, {
            volume: volume
        });
    }

};
