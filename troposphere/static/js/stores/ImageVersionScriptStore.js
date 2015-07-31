define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ImageVersionScriptCollection = require('collections/ImageVersionScriptCollection'),
      ImageVersionScriptConstants = require('constants/ImageVersionScriptConstants'),
      ScriptCollection = require('collections/ScriptCollection'),
      Script = require('models/Script');

  var _modelsFor = {};
  var _isFetchingFor = {};

  var ImageVersionScriptStore = BaseStore.extend({
    collection: ImageVersionScriptCollection,

    initialize: function(){
      this.models = new ImageVersionScriptCollection();
    },

    fetchModelsFor: function(imageVersionId){
      if(!_modelsFor[imageVersionId] && !_isFetchingFor[imageVersionId]) {
        _isFetchingFor[imageVersionId] = true;
        var models = new ImageVersionScriptCollection();
        models.fetch({
          url: models.url + "?version_id=" + imageVersionId
        }).done(function () {
          _isFetchingFor[imageVersionId] = false;

          // add models to existing cache
          this.models.add(models.models);

          // convert ImageVersionScript collection to a ScriptCollection
          var scripts = models.map(function(version_script){
            return new Script(version_script.get('script'), {parse: true});
          });
          scripts = new ScriptCollection(scripts);

          _modelsFor[imageVersionId] = scripts;
          this.emitChange();
        }.bind(this));
      }
    },

    getScriptsFor: function(imageversion){
      if(!_modelsFor[imageversion.id]) return this.fetchModelsFor(imageversion.id);

      // convert ImageVersionScript collection to an ScriptCollection
      var imageVersionScripts = this.models.filter(function(version_script){
        return version_script.get('image_version').id === imageversion.id;
      });

      var scripts = imageVersionScripts.map(function(version_script){
        return new Script(version_script.get('boot_script'), {parse: true});
      });
      return new ScriptCollection(scripts);
    }

  });

  var store = new ImageVersionScriptStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ImageVersionScriptConstants.ADD_IMAGEVERSION_SCRIPT:
        store.add(payload.image_versionScript);
        break;

      case ImageVersionScriptConstants.REMOVE_IMAGEVERSION_SCRIPT:
        store.remove(payload.image_versionScript);
        break;

      case ImageVersionScriptConstants.EMIT_CHANGE:
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
