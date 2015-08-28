define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ScriptConstants= require('constants/ScriptConstants'),
      ScriptCollection = require('collections/ScriptCollection');

  var ScriptStore = BaseStore.extend({
    collection: ScriptCollection,

    exists: function (modelId) {
      if(!this.models) return this.fetchModels();
      return this.models.get(modelId) != null;
    },

    queryParams: {
      page_size: 6000
    },


    getScriptsForVersion: function(version) {
      if(!this.models) throw new Error("Must fetch users before calling getScriptsFromList");

      var versionScriptArray = version.script.map(function(user){
        return {"username":user};
      });

      return new ScriptCollection(versionScriptArray);
    },

    getScriptsFromList: function (usernameList) {
      if(!this.models) throw new Error("Must fetch users before calling getScriptsFromList");
      var users = usernameList.map(function(username){
        var user = this.models.findWhere({username: username});
        return user;
      }.bind(this));

      return new ScriptCollection(users);
    }

  });

  var store = new ScriptStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ScriptConstants.ADD_SCRIPT:
        store.add(payload.script);
        break;

      case ScriptConstants.UPDATE_SCRIPT:
        store.update(payload.script);
        break;

      case ScriptConstants.REMOVE_SCRIPT:
        store.remove(payload.script);
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
