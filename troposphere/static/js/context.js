define([], function () {
  return {
    hasLoggedInUser: function() {
        return !!this.profile.get('username');
    },
    profile: null
  }
});
