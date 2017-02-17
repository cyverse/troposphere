import globals from "globals";

const jetstreamAllocation = {
    requestMoreFromLaunchLabel: function() {
        return `Request additional ${this.unitName}`
    },
    unitName: "service units",
    unitAbbrev: "SUs",
    getAllocationConsumedLabel: function(percent, total) {
        return `You have used ${percent}% of ${total} ${this.unitAbbrev}`;
    }

}

const cyverseAllocation = {
    requestMoreFromLaunchLabel: function() {
        return "Request more Resources"
    },
    unitName: "allocation units",
    unitAbbrev: "AUs",
    getAllocationConsumedLabel: function(percent, total) {
        return `You have used ${percent}% of ${total} ${this.unitAbbrev} from this provider`;
    }
}

let messages = globals.USE_ALLOCATION_SOURCES ? jetstreamAllocation : cyverseAllocation;

export default messages;
