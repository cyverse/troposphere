define(
  [
    'collections/base',
    'models/identity'
  ],
  function (Base, Identity) {

    return Base.extend({
      model: Identity,

      url: function () {
        return url = this.urlRoot
          + '/' + this.model.prototype.defaults.model_name;
      }

    });

  });
