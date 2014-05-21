define([], function () {
    return {
        API_ROOT: window.location.hostname == 'localhost' ? 'http://atmosphere.apiary-mock.com' : '/api/v1'
    }
});
