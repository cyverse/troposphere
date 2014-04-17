define(['react', 'collections/sizes', 'rsvp',
'collections/providers'], function(React, Sizes, RSVP, Providers) {

    var cachedSizes = {};

    var getSizesUncached = function(providerId, identityId) {
        return new RSVP.Promise(function(resolve, reject) {
            var sizes = new Sizes([], {
                provider_id: providerId,
                identity_id: identityId
            });
            sizes.on('sync', resolve);
            sizes.fetch();
        });
    };
    
    var getSizeCollection = function(providerId, identityId) {
        return new RSVP.Promise(function(resolve, reject) {
            if (cachedSizes[providerId]) {
                resolve(cachedSizes[providerId]);
            } else {
                getSizesUncached(providerId, identityId)
                    .then(function(collection) {
                        cachedSizes[providerId] = collection;
                        resolve(collection);
                    })
                    .catch(reject);
            }
        });
    };

    var getProviders = function() {
        var providers = new Providers();
        return new RSVP.Promise(function(resolve, reject) {
            providers.fetch({
                success: resolve,
                error: reject
            });
        });
    };

    return {
        getProviders: getProviders,
        getSizeCollection: getSizeCollection
    };

});
