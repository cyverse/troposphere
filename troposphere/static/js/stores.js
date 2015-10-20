// Note: while we could include all the stores here, I'm not going to
// instead, I'm going to let the application load the stores it needs
// to use during the bootstrapping process so that the application
// will throw exceptions if any stores don't exist (which will be the default
// state for functional tests that need mocked stores)

export default function () {
    return {
        // add stores here
    }
};
