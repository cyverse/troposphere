
import BaseStore from 'stores/BaseStore';
import MembershipCollection from 'collections/MembershipCollection';

let MembershipStore = BaseStore.extend({
    collection: MembershipCollection,

    exists: function(modelId) {
        if (!this.models) return this.fetchModels();
        return this.models.get(modelId) != null;
    },

    queryParams: {
        page_size: 6000
    },


    getMembershipsForVersion: function(version) {
        if (!this.models) throw new Error("Must fetch users before calling getMembershipsFromList");

        var versionMembershipArray = version.membership.map(function(user) {
            return {
                "username": user
            };
        });

        return new MembershipCollection(versionMembershipArray);
    },

    getMembershipsFromList: function(usernameList) {
        if (!this.models) throw new Error("Must fetch users before calling getMembershipsFromList");
        var users = usernameList.map(function(username) {
            var user = this.models.findWhere({
                username: username
            });
            return user;
        }.bind(this));

        return new MembershipCollection(users);
    }

});

let store = new MembershipStore();


export default store;
