define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      InstanceCollection = require('collections/InstanceCollection'),
      InstanceConstants = require('constants/InstanceConstants');

  var pollingFrequency = 10*1000;
  var _instancesBuilding = [];

  var InstanceStore = BaseStore.extend({
    collection: InstanceCollection,

    //queryParams: {
    //  page_size: 100
    //},

    // todo: differences between this and base class implementation
    // page_size query param
    // pollNowUntilBuildIsFinished
    fetchModels: function () {
      if (!this.models && !this.isFetching) {
        this.isFetching = true;
        var models = new this.collection();
        models.fetch({
          url: models.url + "?page_size=100"
        }).done(function(){
          this.isFetching = false;
          this.models = models;
          this.models.each(this.pollNowUntilBuildIsFinished.bind(this));
          this.emitChange();
        }.bind(this));
      }
    },

    //
    // Custom functions
    //

    getInstancesOnProvider: function (provider) {
      if(!this.models) return this.fetchModels();

      var instances = this.models.filter(function(instance){
        return instance.get('provider').id === provider.id;
      });

      return new InstanceCollection(instances);
    },

    getInstancesNotInAProject: function (provider) {
      if(!this.models) return this.fetchModels();

      var instances = this.models.filter(function(instance){
        return instance.get('projects').length === 0
      });

      return new InstanceCollection(instances);
    },

    //
    // Polling functions
    //

    pollNowUntilBuildIsFinished: function(instance){
      if(_instancesBuilding.indexOf(instance) < 0) {
        _instancesBuilding.push(instance);
        this.fetchNowAndRemoveIfFinished(instance);
      }
    },

    fetchAndRemoveIfFinished: function(instance){
      setTimeout(function(){
        instance.fetchFromCloud(function(){
          this.update(instance);
          var index = _instancesBuilding.indexOf(instance);
          if(instance.get('state').isInFinalState()){
            _instancesBuilding.splice(index, 1);
          }else{
            this.fetchAndRemoveIfFinished(instance);
          }
          this.emitChange();
        }.bind(this));
      }.bind(this), pollingFrequency);
    },

    fetchNowAndRemoveIfFinished: function(instance){
      instance.fetchFromCloud(function(){
        this.update(instance);
        var index = _instancesBuilding.indexOf(instance);
        if(instance.get('state').isInFinalState()){
          _instancesBuilding.splice(index, 1);
        }else{
          this.fetchAndRemoveIfFinished(instance);
        }
        this.emitChange();
      }.bind(this));
    }

  });

  var store = new InstanceStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case InstanceConstants.ADD_INSTANCE:
        store.add(payload.instance);
        break;

      case InstanceConstants.UPDATE_INSTANCE:
        store.update(payload.instance);
        break;

      case InstanceConstants.REMOVE_INSTANCE:
        store.remove(payload.instance);
        break;

      case InstanceConstants.POLL_INSTANCE:
        store.pollNowUntilBuildIsFinished(payload.instance);
        break;

      default:
        return true;
    }

    if(!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
