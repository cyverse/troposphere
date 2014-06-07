define(['collections/base', 'models/application'], function(Base, Application)
{

    var ApplicationSearchResults = Base.extend({
        model: Application,
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
