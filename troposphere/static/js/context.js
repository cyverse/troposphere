
export default {
    hasLoggedInUser: function() {
        return !!(this.profile && this.profile.get('selected_identity'));
    },
    profile: null,
};
