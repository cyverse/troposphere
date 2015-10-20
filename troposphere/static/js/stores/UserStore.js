
import BaseStore from 'stores/BaseStore';
import UserCollection from 'collections/UserCollection';

let UserStore = BaseStore.extend({
    collection: UserCollection,

    exists: function(modelId) {
        if (!this.models) return this.fetchModels();
        return this.models.get(modelId) != null;
    },

    queryParams: {
        page_size: 3000
    },


    getUsersForVersion: function(version) {
        if (!this.models) throw new Error("Must fetch users before calling getUsersFromList");

        var versionUserArray = version.membership.map(function(user) {
            return {
                "username": user
            };
        });

        return new UserCollection(versionUserArray);
    },

    getUsersFromList: function(usernameList) {
        if (!this.models) throw new Error("Must fetch users before calling getUsersFromList");
        var users = usernameList.map(function(username) {
            var user = this.models.findWhere({
                username: username
            });
            return user;
        }.bind(this));

        return new UserCollection(users);
    }

});

let store = new UserStore();

export default store;
