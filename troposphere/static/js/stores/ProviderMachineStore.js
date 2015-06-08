define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/ProviderMachineCollection'),
      Constants = require('constants/ProviderMachineConstants');

  var _models = new Collection();
  var _modelsFor = {};
  var _isFetchingFor = {};

  //
  // CRUD Operations
  //

  var fetchModelsFor = function(imageId){
    if(!_modelsFor[imageId] && !_isFetchingFor[imageId]) {
      _isFetchingFor[imageId] = true;
      var models = new Collection();
      models.fetch({
        url: models.url + "?application_version__application__id=" + imageId
      }).done(function () {
        _isFetchingFor[imageId] = false;

        // add models to existing cache
        _models.add(models.models);

        _modelsFor[imageId] = models;
        ModelStore.emitChange();
      });
    }
  };

  function update(model) {
    var existingModel = _models.get(model);
    if (!existingModel) throw new Error("ProviderMachine doesn't exist.");
    _models.add(model, {merge: true});
  }

  //
  // Model Store
  //

  var ModelStore = {

    getProviderMachinesFor: function(image){
      if(!_modelsFor[image.id]) return fetchModelsFor(image.id);

      var machines = _models.filter(function(m){
        // filter out the machines not associated with the image
        return m.get('image').id === image.id;
      });

      // todo: implement api/v2/provider_machines?application_version__application__id=902
      // Until then return only the first provider machine so the application doesn't blow up
      return new Collection(_models.first());
      //return new Collection(machines);
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case Constants.UPDATE_PROVIDER_MACHINE:
        update(payload.machine);
        break;

      case Constants.EMIT_CHANGE:
        break;

      default:
        return true;
    }

    if(!options.silent) {
      ModelStore.emitChange();
    }

    return true;
  });

  _.extend(ModelStore, Store);

  return ModelStore;
});
