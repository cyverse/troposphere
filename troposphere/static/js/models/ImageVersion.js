import Backbone from "backbone";
import globals from "globals";
import moment from "moment";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/image_versions",

    parse: function(attributes) {

        attributes.start_date = moment(attributes.start_date);
        attributes.end_date = attributes.end_date ? moment(attributes.end_date) : null; //NOTE: Null 'moment' objects are hard to spot! best to set it null.
        attributes.description = attributes.description || "";

        return attributes;
    },

    isEndDated: function() {
        let endDate = this.get("end_date"),
            image = this.get("image"),
            result = endDate && endDate.isValid();
        if (!result) {
            endDate = moment(image.end_date);
            result = endDate && endDate.isValid();
        }

        return result;
    }
});
