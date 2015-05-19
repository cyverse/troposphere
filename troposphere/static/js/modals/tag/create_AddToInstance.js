define(function (require) {
  'use strict';

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      TagConstants = require('constants/TagConstants'),
      Tag = require('models/Tag'),
      actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      TagCreateModal = require('components/modals/tag/TagCreateModal.react');

  return {

    create_AddToInstance: function(initialTagName, instance){

      var modal = TagCreateModal({
        initialTagName: initialTagName
      });

      ModalHelpers.renderModal(modal, function(name, description){

        actions.TagActions.create_AddToInstance({
          name: name,
          description: description,
          instance: instance
        })

        //var tag = new Tag({
        //  name: name,
        //  description: description
        //});

        // Add the tag optimistically
        //Utils.dispatch(TagConstants.ADD_TAG, {tag: tag}, {silent: false});
        //tag.save().done(function () {
        //  Utils.dispatch(TagConstants.UPDATE_TAG, {tag: tag}, {silent: false});
        //  Utils.dispatch(TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE, {tag: tag, instance: instance});
        //  actions.InstanceTagActions.add({
        //    instance: instance,
        //    tag: tag
        //  });
        //}.bind(this)).fail(function () {
        //  Utils.dispatch(TagConstants.REMOVE_TAG, {tag: tag}, {silent: false});
        //  Utils.dispatch(TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE, {tag: tag, instance: instance});
        //}.bind(this));

        //Utils.dispatch(TagConstants.ADD_PENDING_TAG_TO_INSTANCE, {tag: tag, instance: instance});

      })
        //.bind(this));

    }

  };

});
