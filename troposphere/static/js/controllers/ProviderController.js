define(
  [
    'react',
    'collections/SizeCollection',
    'rsvp',
    'collections/ProviderCollection'
  ],
  function (React, SizeCollection, RSVP, ProviderCollection) {

    var cachedSizes = {};

    var getSizesUncached = function (providerId, identityId) {
      return new RSVP.Promise(function (resolve, reject) {
        var sizes = new SizeCollection([], {
          provider_id: providerId,
          identity_id: identityId
        });
        sizes.on('sync', resolve);
        sizes.fetch();
      });
    };

    var getSizeCollection = function (providerId, identityId) {
      return new RSVP.Promise(function (resolve, reject) {
        if (cachedSizes[providerId]) {
          resolve(cachedSizes[providerId]);
        } else {
          getSizesUncached(providerId, identityId)
            .then(function (collection) {
              cachedSizes[providerId] = collection;
              resolve(collection);
            })
            .catch(reject);
        }
      });
    };

    var getProviders = function () {
      var providers = new ProviderCollection();
      return new RSVP.Promise(function (resolve, reject) {
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