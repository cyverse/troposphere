define(['collections/base'], function(Base) {

    var ApplicationSearchResults = Base.extend({
        initialize: function(models, options) {
            if (options.query)
                this.query = options.query;
        },
        url: function() {
            return this.urlRoot + '/application/search?query=' +
                encodeURIComponent(this.query);
        }
    });

    return ApplicationSearchResults;

});
