define([], function () {
    return {
        API_ROOT: window.location.host == 'localhost' ? 'http://atmosphere.apiary-mock.com' : '/api/v1'
    }
});
