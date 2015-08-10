define(function (require) {

  var BaseStore = require('stores/BaseStore'),
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

  return store;
});
