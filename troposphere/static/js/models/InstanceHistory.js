import Backbone from "backbone";
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

    getCreds: function() {
        return {
            provider_id: this.get("identity").provider,
            identity_id: this.get("identity").id
        };
    },

    parse: function(response) {
        var attributes = response;
        attributes.id = attributes.alias;
        attributes.start_date = moment(attributes.start_date);
        attributes.end_date = moment(attributes.end_date);
        return attributes;
    },

    isEndDated: function() {
        return safeIsValid(this.get("end_date"));
    }
});
