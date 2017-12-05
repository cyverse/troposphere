
import BaseStore from "stores/BaseStore";
import GroupCollection from "collections/GroupCollection";

let GroupStore = BaseStore.extend({
    collection: GroupCollection,

    exists: function(modelId) {
        if (!this.models) return this.fetchModels();
        return this.models.get(modelId) != null;
    },
    getPrivateGroup: function() {
        let identity_key = "?is_private=true",
            query_params = {"is_private" : true};
        if (!this.queryModels[identity_key]) {
            return this.fetchWhere(query_params);
        } else {
            return this.queryModels[identity_key];
        }
    },
    getGroupsForIdentity: function(identityObj) {
        if (this.models) {
            return this.fetchModels();
        }
        let identity_key = "?identity_uuid="+identityObj.uuid,
            query_params = {"identity_uuid" : identityObj.uuid};
        if (!this.queryModels[identity_key]) {
            return this.fetchWhere(query_params);
        } else {
            return this.queryModels[identity_key];
        }
    },


    getGroupsFromList: function(groupnameList) {
        if (!this.models)
            throw new Error("Must fetch groups before calling getGroupsFromList");
        var groups = groupnameList.map(function(groupname) {
            var group = this.models.findWhere({
                name: groupname
            });
            return group;
        }.bind(this));

        return new GroupCollection(groups);
    }

});

let store = new GroupStore();

export default store;
