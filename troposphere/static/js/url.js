/* Module for generating in-app urls */
define(['underscore'], function(_) {

    var generators = {
        instance: function(model) {
            var providerId = model.get('identity').provider;
            var identityId = model.get('identity').id;
            return 'provider/' + providerId + '/identity/' + identityId + '/instances/' + model.id;
        },
        volume: function(model) {
            var providerId = model.get('identity').provider;
            var identityId = model.get('identity').id;
            return 'provider/' + providerId + '/identity/' + identityId + '/volumes/' + model.id;
        },
        application: function(model) {
            return 'images/' + model.id; 
        }
    };

    var generateUrl = function(model_type, model, options) {
        var defaultOptions = {
            absolute: false
        };
        var options = _.defaults(options || {}, defaultOptions);
        var url = generators[model_type](model);
        if (options.absolute)
            url = url_root + '/' + url;
        return url;
    };

    return {
        instance: _.partial(generateUrl, 'instance'),
        volume: _.partial(generateUrl, 'volume'),
        application: _.partial(generateUrl, 'application')
    };

});
