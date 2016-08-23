import { hasLoggedInUser } from 'utilities/profilePredicate';

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
    profile: null
};
