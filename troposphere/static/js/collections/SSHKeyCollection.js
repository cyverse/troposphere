import Backbone from 'backbone';
import SSHKey from 'models/SSHKey';
import globals from 'globals';


export default Backbone.Collection.extend({
    model: SSHKey,
    url: globals.API_V2_ROOT + "/ssh_keys",
    parse: function(data) {
        return data.results;
    },
});
