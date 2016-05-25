
import InstanceConstants from 'constants/InstanceConstants';
import Utils from '../Utils';

export default {

    poll: function(params) {
        var instance = params.instance;
        if (!instance) throw new Error("Missing instance");
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
            instance: instance
        });
    }

};
