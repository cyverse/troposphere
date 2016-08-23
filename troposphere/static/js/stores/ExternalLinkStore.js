import _ from 'underscore';
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ExternalLinkCollection from 'collections/ExternalLinkCollection';
import ExternalLinkConstants from 'constants/ExternalLinkConstants';

let ExternalLinkStore = BaseStore.extend({
    collection: ExternalLinkCollection,

    queryParams: {
      page_size: 100
    },

    getExternalLinksNotInAProject: function () {
      if (!this.models) return this.fetchModels();

      var external_links = this.models.filter(function (external_link) {
        return external_link.get('projects').length === 0
      });

      return new ExternalLinkCollection(external_links);
    },
});

var store = new ExternalLinkStore();

Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ExternalLinkConstants.ADD_LINK:
        store.add(payload.external_link);
        break;

      case ExternalLinkConstants.UPDATE_LINK:
        store.update(payload.external_link);
        break;

      case ExternalLinkConstants.REMOVE_LINK:
        store.remove(payload.external_link);
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
