define(function (require) {
  'use strict';

  var _ = require('underscore'),
    Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    ExternalLinkCollection = require('collections/ExternalLinkCollection'),
    ExternalLinkConstants = require('constants/ExternalLinkConstants');

  var ExternalLinkStore = BaseStore.extend({
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
        store.add(payload.link);
        break;

      case ExternalLinkConstants.UPDATE_LINK:
        store.update(payload.link);
        break;

      case ExternalLinkConstants.REMOVE_LINK:
        store.remove(payload.link);
        break;

      default:
        return true;
    }

    if (!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
