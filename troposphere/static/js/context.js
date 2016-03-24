import { hasLoggedInUser } from 'utilities/profilePredicate';

export default {
    hasLoggedInUser: function() {
        return hasLoggedInUser(this.profile);
    },
    profile: null
}
