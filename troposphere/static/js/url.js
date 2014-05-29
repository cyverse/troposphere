/* Module for generating in-app urls */
define(['underscore'], function(_) {

    var generators = {
        instance: function(model) {
            var providerId = model.get('identity').provider;
            var identityId = model.get('identity').id;
            return 'provider/' + providerId + '/identity/' + identityId + '/instances/' + model.id;
        },
        reportInstance: function(model) {
            return generators.instance(model) + '/report';
        },
        volume: function(model) {
            var providerId = model.get('identity').provider;
            var identityId = model.get('identity').id;
            return 'provider/' + providerId + '/identity/' + identityId + '/volumes/' + model.id;
        },
        application: function(model) {
            return 'images/' + model.id;
        },
        requestImage: function(model){
            var providerId = model.get('identity').provider;
            var identityId = model.get('identity').id;
            return 'provider/' + providerId + '/identity/' + identityId + '/instances/' + model.id + '/request_image';
        }
    };

    var generateUrl = function(route, model, options) {
        var defaultOptions = {
            absolute: false
        };
        var options = _.defaults(options || {}, defaultOptions);
        var url = generators[route](model);
        if (options.absolute)
            url = '/application/' + url;
        return url;
    };

    return {
        instance: _.partial(generateUrl, 'instance'),
        reportInstance: _.partial(generateUrl, 'reportInstance'),
        volume: _.partial(generateUrl, 'volume'),
        application: _.partial(generateUrl, 'application'),
        requestImage: _.partial(generateUrl, 'requestImage')
    };

});
