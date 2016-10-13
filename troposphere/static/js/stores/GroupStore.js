
import BaseStore from "stores/BaseStore";
import GroupCollection from "collections/GroupCollection";

let GroupStore = BaseStore.extend({
    collection: GroupCollection,

    exists: function(modelId) {
        if (!this.models) return this.fetchModels();
        return this.models.get(modelId) != null;
    },

    queryParams: {
        page_size: 3000
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
