define(function (require) {

  var BaseStore = require('stores/BaseStore'),
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

  return store;
});
