define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    LicenseConstants= require('constants/LicenseConstants'),
    LicenseCollection = require('collections/LicenseCollection');

  var LicenseStore = BaseStore.extend({
    collection: LicenseCollection,

    exists: function (modelId) {
      if(!this.models) return this.fetchModels();
      return this.models.get(modelId) != null;
    },

    queryParams: {
      page_size: 6000
    },


    getLicensesForVersion: function(version) {
      if(!this.models) throw new Error("Must fetch users before calling getLicensesFromList");

      var versionLicenseArray = version.license.map(function(user){
        return {"username":user};
      });

      return new LicenseCollection(versionLicenseArray);
    },

    getLicensesFromList: function (usernameList) {
      if(!this.models) throw new Error("Must fetch users before calling getLicensesFromList");
      var users = usernameList.map(function(username){
        var user = this.models.findWhere({username: username});
        return user;
      }.bind(this));

      return new LicenseCollection(users);
    }

  });

  var store = new LicenseStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case LicenseConstants.ADD_LICENSE:
        store.add(payload.license);
        break;

      case LicenseConstants.UPDATE_LICENSE:
        store.update(payload.license);
        break;

      case LicenseConstants.REMOVE_LICENSE:
        store.remove(payload.license);
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
