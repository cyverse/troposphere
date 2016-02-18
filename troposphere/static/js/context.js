define([], function () {
  return {
    hasLoggedInUser: function() {
        return !!(this.profile && this.profile.get('username'));
    },
    profile: null
  }
});
