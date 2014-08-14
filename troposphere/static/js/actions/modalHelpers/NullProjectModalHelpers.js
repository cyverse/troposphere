define(
  [
    'react',
    './CommonHelpers',
    'components/modals/NullProjectMigrateResourceModal.react',
    'moment',
    'underscore'
  ],
  function (React, CommonHelpers, NullProjectMigrateResourceModal, moment, _) {

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
      }

    };

  });
