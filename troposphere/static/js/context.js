import { hasLoggedInUser,
         hasExpiredPassword } from "utilities/profilePredicate";


export default {
    hasMaintenanceNotice: function() {
        return !!window.maint_notice;
    },
    getMaintenanceNotice: function() {
        return window.maint_notice;
    },
    hasLoggedInUser: function() {
        return hasLoggedInUser(this.profile);
    },
    hasExpiredPassword() {
        return hasExpiredPassword(this.profile);
    },
    profile: null
};
