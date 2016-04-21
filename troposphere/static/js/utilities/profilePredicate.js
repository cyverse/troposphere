
const hasLoggedInUser = (profile) => {
    // use `!!` to convert truthy expression into Boolean type
    return !!(profile && profile.get('username'));
};

export { hasLoggedInUser };
