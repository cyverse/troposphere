import Backbone from "backbone";
import globals from "globals";
import moment from "moment";

/**
 * Return a boolean indicating if a date is valid
 *
 * It might be enough to do:
 *   obj && obj.isValid && obj.isValid()
 */
const safeIsValid = (obj) => {
    return obj
        && obj.isValid
        && (typeof obj.isValid === 'function')
        && obj.isValid();
}

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/image_versions",

    parse: function(attributes) {
        attributes.start_date = moment(attributes.start_date);
        //NOTE: Null 'moment' objects are hard to spot! best to set it null
        attributes.end_date = attributes.end_date ? moment(attributes.end_date) : null;
        attributes.description = attributes.description || "";

        return attributes;
    },

    isEndDated: function() {
        let endDate = this.get("end_date"),
            image = this.get("image"),
            result = safeIsValid(endDate);
        if (!result) {
            endDate = moment(image.end_date);
            result = safeIsValid(endDate);
        }

        return result;
    },

    hasDOI: function() {
        // convert value to a Boolean when returned
        return !!this.get("doc_object_id");
    }
});
