define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/TagConstants',
    'components/modals/TagCreateModal.react',
    'models/Tag',
    'actions/InstanceActions',
    './modalHelpers/TagModalHelpers'
  ],
  function (React, AppDispatcher, TagConstants, TagCreateModal, Tag, InstanceActions, TagModalHelpers) {

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

        TagModalHelpers.create({name: initialTagName}, {
          onConfirm: function(name, description){

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

          }.bind(this)
        });
      }

    };

  });
