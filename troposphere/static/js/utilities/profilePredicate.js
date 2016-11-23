
const hasLoggedInUser = (profile) => {
    // use `!!` to convert truthy expression into Boolean type
    return !!(profile && profile.get("username"));
};

const hasExpiredPassword = (profile) => {
    return hasLoggedInUser(profile) && !!(profile.get("is_expired"));
}

export { hasLoggedInUser, hasExpiredPassword };
