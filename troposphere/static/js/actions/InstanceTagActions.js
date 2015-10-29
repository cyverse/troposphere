
import AppDispatcher from 'dispatchers/AppDispatcher';
import InstanceTagConstants from 'constants/InstanceTagConstants';
import InstanceTag from 'models/InstanceTag';
import Utils from './Utils';
import stores from 'stores';

export default {

    add: function (params) {
      if (!params.instance) throw new Error("Missing instance");
      if (!params.tag) throw new Error("Missing tag");

      var instance = params.instance,
        tag = params.tag,
        instanceTag = new InstanceTag(),
        data = {
          instance: instance.id,
          tag: tag.id
        };

      instanceTag.save(null, {
        attrs: data
      }).done(function () {
        Utils.dispatch(InstanceTagConstants.ADD_INSTANCE_TAG, {instanceTag: instanceTag});
      }).fail(function (response) {
        Utils.displayError({title: "Tag could not be added to Instance", response: response});
      });
    },

    remove: function (params) {
      if (!params.instance) throw new Error("Missing instance");
      if (!params.tag) throw new Error("Missing tag");

      var instance = params.instance,
        tag = params.tag,
        instanceTag = stores.InstanceTagStore.findOne({
          'instance.id': instance.id,
          'tag.id': tag.id
        });

      instanceTag.destroy().done(function () {
        Utils.dispatch(InstanceTagConstants.REMOVE_INSTANCE_TAG, {instanceTag: instanceTag});
      }).fail(function (response) {
        Utils.displayError({title: "Tag could not be removed from Instance", response: response});
      });
    }

  };
