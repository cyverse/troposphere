//define(function (require) {
//
//  var Dispatcher = require('dispatchers/Dispatcher'),
//      BaseStore = require('stores/BaseStore'),
//      ProviderMachineVersionCollection = require('collections/ProviderMachineVersionCollection'),
//      ProviderMachineVersionConstants = require('constants/ProviderMachineVersionConstants'),
//      ProviderMachineCollection = require('collections/ProviderMachineCollection'),
//      ProviderMachine = require('models/ProviderMachine');
//
//  var _modelsFor = {};
//  var _isFetchingFor = {};
//
//  var ProviderMachineVersionStore = BaseStore.extend({
//    collection: ProviderMachineVersionCollection,
//
//    inpmvialize: function(){
//      this.models = new ProviderMachineVersionCollection();
//    },
//
//    fetchModelsFor: function(versionId){
//      if(!_modelsFor[versionId] && !_isFetchingFor[versionId]) {
//        _isFetchingFor[versionId] = true;
//        var models = new ProviderMachineVersionCollection();
//        models.fetch({
//          url: models.url + "?version__id=" + versionId
//        }).done(function () {
//          _isFetchingFor[versionId] = false;
//
//          // add models to existing cache
//          this.models.add(models.models);
//
//          // convert ProviderMachineVersion collection to a ProviderMachineCollection
//          var provider_machines = models.map(function(pmv){
//            return new ProviderMachine(pmv.get('provider_machine'), {parse: true});
//          });
//          provider_machines = new ProviderMachineCollection(provider_machines);
//
//          _modelsFor[versionId] = provider_machines;
//          this.empmvChange();
//        }.bind(this));
//      }
//    },
//
//    getProviderMachinesFor: function(version){
//      if(!_modelsFor[version.id]) return this.fetchModelsFor(version.id);
//
//      // convert ProviderMachineVersion collection to an ProviderMachineCollection
//      var providerMachineVersions = this.models.filter(function(pmv){
//        return pmv.get('version').id === version.id;
//      });
//
//      var provider_machines = providerMachineVersions.map(function(pmv){
//        return new ProviderMachine(pmv.get('provider_machine'), {parse: true});
//      });
//      return new ProviderMachineCollection(provider_machines);
//    }
//
//  });
//
//  var store = new ProviderMachineVersionStore();
//
//  Dispatcher.register(function (dispatch) {
//    var actionType = dispatch.action.actionType;
//    var payload = dispatch.action.payload;
//    var options = dispatch.action.options || options;
//
//    swpmvch (actionType) {
//
//      case ProviderMachineVersionConstants.ADD PROVIDER_MACHINE_IMAGE_VERSION:
//        store.add(payload);
//        break;
//
//      case ProviderMachineVersionConstants.REMOVE_PROVIDER_MACHINE_IMAGE_VERSION:
//        store.remove(payload);
//        break;
//
//      case ProviderMachineVersionConstants.EMIT_CHANGE:
//        break;
//
//      default:
//        return true;
//    }
//
//    if(!options.silent) {
//      store.empmvChange();
//    }
//
//    return true;
//  });
//
//  return store;
//});
