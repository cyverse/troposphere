
import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import ResourceRequestCollection from "collections/ResourceRequestCollection";
import ResourceRequestConstants from "constants/ResourceRequestConstants";

let ResourceRequestStore = BaseStore.extend({
    collection: ResourceRequestCollection,

    // FIXME:
    // ------
    // this is part of an attempt to make the RequestMoreResouresModal
    // not crash for a specific user.
    //
    // the real cause of the issue is not 100% understood - it may be
    // mismatched validation logic (from what has been seen within the
    // commit history explored).
    // -----------------------------------------------------------------
    // Looks through the local cache and returns any models matched the
    // provided parameters
    //
    // @params: Object, like {name: 'example'} or {'provider.id': 1}
    //          provided params can be at most 1 extra level deep
    //          ('provider.id' or 'provider')
    findResourceRequestsWhere: function(params) {
        if (!this.models) return this.fetchModels();

        var keys = Object.keys(params);

        var models = this.models.cfilter(function(model) {
            var matchesCriteria = true;

            keys.forEach(function(key) {
                if (!matchesCriteria) return;

                var tokens = key.split(".");
                if (tokens.length === 1) {
                    if (model.get(key) !== params[key])
                        matchesCriteria = false;
                } else {
                    var lookup = model.get(tokens[0])
                    // this is really a De Morgan's Law opposite to
                    // !(lookup && lookup[tokens[1]] == params[key])
                    //
                    // since the condition is really guarding a logical
                    // negation - it seems that this form would be more
                    // in line w/ the intent (but the real weight of
                    // that is not defended nor is a proof attempted).
                    if (!lookup || lookup[tokens[1]] !== params[key])
                        matchesCriteria = false;
                }
            });

            return matchesCriteria;
        });

        return models;
    }

});

let store = new ResourceRequestStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case ResourceRequestConstants.ADD:
            store.add({
                data: payload.model,
                at: 0
            });
            break;

        case ResourceRequestConstants.UPDATE:
            store.update(payload.model);
            break;

        case ResourceRequestConstants.REMOVE:
            store.remove(payload.model);
            break;

        case ResourceRequestConstants.EMIT_CHANGE:
            break;

        default:
            return true;
    }

    if (!options.silent) {
        store.emitChange();
    }

    return true;
});

export default store;
