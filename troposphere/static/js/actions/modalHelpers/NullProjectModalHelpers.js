define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'moment',
    'underscore'
  ],
  function (React, CommonHelpers, CancelConfirmModal, moment, _) {

    return {

      migrateResources: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var nullProject = payload.nullProject;
        var dateTimeStamp = moment().format("MMMM Do YYYY, h:mm:ss a");

        var onConfirm = function(){
          options.onConfirm(dateTimeStamp);
        };

        var body = "Looks like you have resources that aren't in a project. Migrate? " +
                   "This will create a new project called '" + dateTimeStamp +
                   "' and move all of these resources into that project.";

        var modal = CancelConfirmModal({
          header: "Migrate Project",
          confirmButtonMessage: "Yes, migrate resources into project",
          body: body,
          onConfirm: onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
