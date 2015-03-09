define(function (require) {

    var _ = require('underscore'),
        Dispatcher = require('dispatchers/Dispatcher'),
        Store = require('stores/Store'),
        Collection = require('collections/InstanceCollection'),
        Constants = require('constants/InstanceConstants');

    var _models = null;
    var _isFetching = false;

    var pollingFrequency = 10*1000;
    var _instancesBuilding = [];

    //
    // CRUD Operations
    //

    var fetchModels = function () {
      if(!_models && !_isFetching) {
        _isFetching = true;
        var models = new Collection();
        models.fetch({
          url: models.url + "?page_size=100"
        }).done(function () {
          _isFetching = false;
          _models = models;
          _models.each(pollNowUntilBuildIsFinished);
          ModelStore.emitChange();
        });
      }
    };

    function add(model) {
      _models.add(model);
    }

    function update(model) {
      var existingModel = _models.get(model);
      if (!existingModel) throw new Error("Instance doesn't exist.");
      _models.add(model, {merge: true});
    }

    function remove(model) {
      _models.remove(model);
    }

    //
    // Polling Functions
    //

    var pollNowUntilBuildIsFinished = function(instance){
      if(_instancesBuilding.indexOf(instance) < 0) {
        _instancesBuilding.push(instance);
        fetchNowAndRemoveIfFinished(instance);
      }
    };

    var fetchAndRemoveIfFinished = function(instance){
      setTimeout(function(){
        instance.fetchFromCloud(function(){
          update(instance);
          var index = _instancesBuilding.indexOf(instance);
          if(instance.get('state').isInFinalState()){
            _instancesBuilding.splice(index, 1);
          }else{
            fetchAndRemoveIfFinished(instance);
          }
          ModelStore.emitChange();
        });
      }, pollingFrequency);
    };

    var fetchNowAndRemoveIfFinished = function(instance){
      instance.fetchFromCloud(function(){
        update(instance);
        var index = _instancesBuilding.indexOf(instance);
        if(instance.get('state').isInFinalState()){
          _instancesBuilding.splice(index, 1);
        }else{
          fetchAndRemoveIfFinished(instance);
        }
        ModelStore.emitChange();
      });
    };

    //
    // Instance Store
    //

    var ModelStore = {

      getAll: function () {
        if(!_models) {
          fetchModels()
        }
        return _models;
      },

      get: function (modelId) {
        if(!_models) {
          fetchModels();
        } else {
          return _models.get(modelId);
        }
      },

      getInstancesOnProvider: function (provider) {
        if(!_models) return fetchModels();

        var instances = _models.filter(function(instance){
          return instance.get('provider').id === provider.id;
        });

        return new Collection(instances);
      },

      getInstancesNotInAProject: function (provider) {
        if(!_models) return fetchModels();

        var instances = _models.filter(function(instance){
          return instance.get('projects').length === 0
        });

        return new Collection(instances);
      }

    };

    Dispatcher.register(function (dispatch) {
      var actionType = dispatch.action.actionType;
      var payload = dispatch.action.payload;
      var options = dispatch.action.options || options;

      switch (actionType) {

        case Constants.ADD_INSTANCE:
          add(payload.instance);
          break;

        case Constants.UPDATE_INSTANCE:
          update(payload.instance);
          break;

        case Constants.REMOVE_INSTANCE:
          remove(payload.instance);
          break;

        case Constants.POLL_INSTANCE:
          //pollNowUntilBuildIsFinished(payload.instance);
          console.warn("Polling not enabled yet...");
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
