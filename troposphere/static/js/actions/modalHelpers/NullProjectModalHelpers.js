define(
  [
    'react',
    './CommonHelpers',
    'components/modals/NullProjectMigrateResourceModal.react',
    'components/modals/NullProjectMoveAttachedVolumesModal.react',
    'moment',
    'underscore'
  ],
  function (React, CommonHelpers, NullProjectMigrateResourceModal, NullProjectMoveAttachedVolumesModal, moment, _) {

    return {

      migrateResources: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var resources = payload.resources;
        var dateTimeStamp = moment().format("MMMM Do YYYY, h:mm:ss a");

        var onConfirm = function(){
          options.onConfirm(dateTimeStamp);
        };

        var modal = NullProjectMigrateResourceModal({
          header: "Migrate Resources",
          confirmButtonMessage: "Yes, migrate resources into project",
          resources: resources,
          dateTimeStamp: dateTimeStamp,
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      moveAttachedVolumesIntoInstanceProject: function(payload, options){
        var movedVolumesArray = payload.movedVolumesArray;

        var modal = NullProjectMoveAttachedVolumesModal({
          header: "Move attached volumes into instance project",
          confirmButtonMessage: "Understood",
          movedVolumesArray: movedVolumesArray,
          handleHidden: CommonHelpers.onCancel,
          backdrop: 'static'
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
