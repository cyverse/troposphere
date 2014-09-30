define(
  [
    'react',
    './CommonHelpers',
    'components/modals/tag/TagCreateModal.react'
  ],
  function (React, CommonHelpers, TagCreateModal) {

    return {

      create: function(initialValues, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = TagCreateModal({
          header: "Create Tag",
          confirmButtonMessage: "Create tag",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel,
          initialTagName: initialValues.name
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
