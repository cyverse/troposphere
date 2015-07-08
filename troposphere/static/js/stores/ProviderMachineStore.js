define(function (require) {

  var ProviderMachineCollection = require('collections/ProviderMachineCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ProviderMachineConstants = require('constants/ProviderMachineConstants'),
      NotificationController = require('controllers/NotificationController');

  var ProviderMachineStore = BaseStore.extend({
    collection: ProviderMachineCollection,

    update: function(machine){
      //machine.save({
      //  name: machine.get('name'),
      //  description: machine.get('description'),
      //  tags: machine.get('tags')
      //}, {
      //  patch: true
      //}).done(function(){
      //  this.emitChange();
      //}.bind(this)).fail(function(){
      //  var failureMessage = "Error updating ProviderMachine " + machine.get('name') + ".";
      //  NotificationController.error(failureMessage);
      //  this.emitChange();
      //}.bind(this));
    },

    get: function (machineId) {
      if(!this.models) return this.fetchModels();
      var machine = BaseStore.prototype.get.apply(this, arguments);
      if(!machine) return this.fetchModel(machineId);
      return machine;
    },
    getMachinesFor: function(image) {
        var image_key = "image=" + image.id;
        var use_query = "?application_version__application__id="+image.id
        if(!this.queryModels[image_key]) {
            this.fetchModelsFor(image_key, use_query);
        } else {
            return this.queryModels[image_key];
        }
    },
    fetchModelsFor: function(image_key, use_query) {
        //Based on 'the key', get all related objects
        if (!this.queryModels[image_key] && !this.isFetching) {
            this.isFetching = true;
            var models = new this.collection();
            models.fetch({
                url: _.result(models, 'url') + use_query
            }).done(function () {
                this.isFetching = false;
                //models = models.filter(function(m){
                //    // filter out the machines not associated with the image
                //    return m.get('image').id === image.id;
                //});
                this.queryModels[image_key] = models;
                if (this.pollingEnabled) {
                    this.models.each(this.pollNowUntilBuildIsFinished.bind(this));
                }
                this.emitChange();

            }.bind(this));
        }
    }
  });

  var store = new ProviderMachineStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case ProviderMachineConstants.UPDATE_PROVIDER_MACHINE:
        store.update(payload);
        break;

      default:
        return true;
    }

    store.emitChange();

    return true;
  });

  return store;
});
