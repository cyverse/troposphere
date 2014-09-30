define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/TagConstants',
    'models/Tag',
    'actions/InstanceActions',
    'components/modals/ModalHelpers',
    'components/modals/tag/TagCreateModal.react'
  ],
  function (React, AppDispatcher, TagConstants, Tag, InstanceActions, ModalHelpers, TagCreateModal) {

    return {

      dispatch: function(actionType, payload, options){
        options = options || {};
        AppDispatcher.handleRouteAction({
          actionType: actionType,
          payload: payload,
          options: options
        });
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
          this.dispatch(TagConstants.ADD_TAG, {tag: tag}, {silent: true});
          tag.save().done(function () {
            this.dispatch(TagConstants.UPDATE_TAG, {tag: tag}, {silent: true});
            this.dispatch(TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE, {tag: tag, instance: instance});
            InstanceActions.addTagToInstance(tag, instance);
          }.bind(this)).fail(function () {
            this.dispatch(TagConstants.REMOVE_TAG, {tag: tag}, {silent: true});
            this.dispatch(TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE, {tag: tag, instance: instance});
          }.bind(this));

          this.dispatch(TagConstants.ADD_PENDING_TAG_TO_INSTANCE, {tag: tag, instance: instance});

        }.bind(this));

      }

    };

  });
