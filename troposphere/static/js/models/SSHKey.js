import Backbone from 'backbone';

export default Backbone.Model.extend({
    urlRoot: API_V2_ROOT + "/ssh_keys",
});
