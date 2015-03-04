define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/TagConstants',
    'models/Tag',
    'actions/InstanceActions',
    'components/modals/ModalHelpers',
    'components/modals/tag/TagCreateModal.react',
    './Utils'
  ],
  function (React, AppDispatcher, TagConstants, Tag, InstanceActions, ModalHelpers, TagCreateModal, Utils) {

    return {

      create: function(initialTagName){

        var modal = TagCreateModal({
          initialTagName: initialTagName
        });

        ModalHelpers.renderModal(modal, function(name, description){

          var tag = new Tag({
            name: name,
            description: description
          });

          // Add the tag optimistically
          Utils.dispatch(TagConstants.ADD_TAG, {tag: tag}, {silent: true});
          tag.save().done(function () {
            Utils.dispatch(TagConstants.UPDATE_TAG, {tag: tag}, {silent: true});
          }.bind(this)).fail(function () {
            Utils.dispatch(TagConstants.REMOVE_TAG, {tag: tag}, {silent: true});
          }.bind(this));

        }.bind(this));
      },

      create_AddToInstance: function(initialTagName, instance){

        var modal = TagCreateModal({
          initialTagName: initialTagName
        });

        ModalHelpers.renderModal(modal, function(name, description){

          var tag = new Tag({
            name: name,
            description: description
          });

          // Add the tag optimistically
          Utils.dispatch(TagConstants.ADD_TAG, {tag: tag}, {silent: true});
          tag.save().done(function () {
            Utils.dispatch(TagConstants.UPDATE_TAG, {tag: tag}, {silent: true});
            Utils.dispatch(TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE, {tag: tag, instance: instance});
            InstanceActions.addTagToInstance(tag, instance);
          }.bind(this)).fail(function () {
            Utils.dispatch(TagConstants.REMOVE_TAG, {tag: tag}, {silent: true});
            Utils.dispatch(TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE, {tag: tag, instance: instance});
          }.bind(this));

          Utils.dispatch(TagConstants.ADD_PENDING_TAG_TO_INSTANCE, {tag: tag, instance: instance});

        }.bind(this));

      }

    };

  });
