import globals from "globals";

export default {
    requestMoreFromLaunchLabel: function() {
        return "Request more Resources"
    },
    unitName: `${globals.ALLOCATION_UNIT_NAME}s`,
    unitAbbrev: `${globals.ALLOCATION_UNIT_ABBREV}s`,
    getAllocationConsumedLabel: function(percent, total) {
        return `You have used ${percent}% of ${total} ${this.unitAbbrev}`;
    }
}
