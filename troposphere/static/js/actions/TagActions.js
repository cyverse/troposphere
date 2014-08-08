define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/TagConstants',
    'components/modals/TagCreateModal.react'
  ],
  function (React, AppDispatcher, TagConstants, TagCreateModal) {

    return {

      create: function(initialTagName, options){
        options = options || {};

        var onConfirm = options.onConfirm || function (name, description) {
          AppDispatcher.handleRouteAction({
            actionType: TagConstants.TAG_CREATE,
            name: name,
            description: description
          });
        };

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = TagCreateModal({
          header: "Create Tag",
          confirmButtonMessage: "Create tag",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel,
          initialTagName: initialTagName
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      create_AddToInstance: function(initialTagName, instance){
        this.create(initialTagName, {
          onConfirm: function(name, description){
            AppDispatcher.handleRouteAction({
              actionType: TagConstants.TAG_CREATE_AND_ADD_TO_INSTANCE,
              name: name,
              description: description,
              instance: instance
            });
          }
        })
      }

    };

  });
