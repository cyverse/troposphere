import Backbone from 'backbone';
import SSHKey from 'models/SSHKey';

export default Backbone.Collection.extend({
    model: SSHKey,
    url: API_V2_ROOT + "/ssh_keys",
    parse: function(data) {
        return data.results;
    },
});
