/* Module for generating in-app urls */
define(['underscore'], function(_) {

    var generators = {
        instance: function(model) {
            var provider_id = model.get('identity').provider;
            var identity_id = model.get('identity').id;
            return 'provider/' + provider_id + '/identity/' + identity_id + '/instances/' + model.id;
        },
        volume: function(model) {
            var provider_id = model.get('identity').provider;
            var identity_id = model.get('identity').id;
            return 'provider/' + provider_id + '/identity/' + identity_id + '/volumes/' + model.id;
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
        volume: _.partial(generateUrl, 'volume')
    };

});
