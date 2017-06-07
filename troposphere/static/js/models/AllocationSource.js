import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({
    idAttribute: "uuid",
    urlRoot: globals.API_V2_ROOT + "/allocation_sources"
});
