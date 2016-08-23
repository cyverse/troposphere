import BaseStore from 'stores/BaseStore';
import SizeCollection from 'collections/SizeCollection';


let SizeStore = BaseStore.extend({
    collection: SizeCollection,

    queryParams: {
        page_size: 100
    }
});

SizeStore.prototype.filterWhereGreaterThanOrEqualTo = function(params) {
    let results = [],
     shouldAdd;

    this.models.each(function(model) {
        shouldAdd = true;
        for (var param in params) {
            if (model.get(param) < params[param]) {
                shouldAdd = false;
            }
        }
        if (shouldAdd) {
            results.push(model);
        }
    });

    return results;
}

let store = new SizeStore();

export default store;
