import { hasLoggedInUser } from 'profilePredicate';

export default {
    hasLoggedInUser: function() {
        return hasLoggedInUser(this.profile);
    },
    profile: null
}
