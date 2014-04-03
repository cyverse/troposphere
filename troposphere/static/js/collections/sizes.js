define(['collections/base', 'models/size', 'underscore'], function(Base, Size, _) {
    return Base.extend({
        model: Size,
        initialize: function(models, options) {
            this.creds = _.pick(options, 'provider_id', 'identity_id');
        }
    });
});
