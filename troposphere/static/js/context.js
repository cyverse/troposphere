define([], function () {
  return {
    hasLoggedInUser: function() {
        return !!(this.profile && this.profile.get('selected_identity'));
    },
    profile: null
  }
});
