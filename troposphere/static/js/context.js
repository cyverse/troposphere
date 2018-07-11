import {hasLoggedInUser, hasExpiredPassword} from "utilities/profilePredicate";

export default {
    hasMaintenanceNotice: function() {
        return !!window.maint_notice;
    },
    getMaintenanceNotice: function() {
        return window.maint_notice;
    },
    getEmulator: function() {
        return window.emulator;
    },
    hasEmulatedSession: function() {
        return window.emulator && window.emulator_token;
    },
    hasLoggedInUser: function() {
        return hasLoggedInUser(this.profile);
    },
    hasExpiredPassword() {
        return hasExpiredPassword(this.profile);
    },
    profile: null
};
