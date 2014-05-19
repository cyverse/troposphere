define(
  [
    'collections/application_search_results',
    'rsvp'
  ],
  function (SearchResults, RSVP) {

    var searchApplications = function (query) {

      var apps = new SearchResults([], {
        query: query
      });

      return new RSVP.Promise(function (resolve, reject) {
        apps.fetch({
          success: function (coll) {
            resolve(coll);
          },
          error: function (coll, response) {
            reject(response.responseText);
          }
        });
      });
    };

    return {
      searchApplications: searchApplications
    };
  });
