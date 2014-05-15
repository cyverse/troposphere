define(['collections/base', 'models/application'], function(Base, Application) {

    return Base.extend({
        model: Application,
        url: function(){
            return url = this.urlRoot
                + '/' + this.model.prototype.defaults.model_name;
        }
    });

});
