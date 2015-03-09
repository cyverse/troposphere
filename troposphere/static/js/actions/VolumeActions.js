define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      VolumeConstants = require('constants/VolumeConstants'),
      ProjectVolumeConstants = require('constants/ProjectVolumeConstants'),
      NotificationController = require('controllers/NotificationController'),
      Volume = require('models/Volume'),
      VolumeState = require('models/VolumeState'),
      ProjectVolumeActions = require('actions/ProjectVolumeActions'),
      VolumeAttachNotifications = require('components/notifications/VolumeAttachNotifications.react'),
      stores = require('stores'),
      globals = require('globals'),

      // Modals
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeAttachRulesModal = require('components/modals/volume/VolumeAttachRulesModal.react'),
      VolumeAttachModal = require('components/modals/volume/VolumeAttachModal.react'),
      VolumeDetachModal = require('components/modals/volume/VolumeDetachModal.react'),
      VolumeDeleteModal = require('components/modals/volume/VolumeDeleteModal.react'),
      VolumeCreateModal = require('components/modals/volume/VolumeCreateModal.react'),
      VolumeReportModal = require('components/modals/volume/VolumeReportModal.react'),
      ExplainVolumeDeleteConditionsModal = require('components/modals/volume/ExplainVolumeDeleteConditionsModal.react'),

      Utils = require('./Utils');

  return {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    updateVolumeAttributes: function (volume, newAttributes) {
      volume.set(newAttributes);
      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

      volume.save({
        name: volume.get('name')
      },{
        patch: true
      }).done(function(){
        //NotificationController.success(null, "Volume name updated");
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
      }).fail(function(response){
        var title = "Error updating Volume " + volume.get('name');
        if(response && response.responseJSON && response.responseJSON.errors){
            var errors = response.responseJSON.errors;
            var error = errors[0];
            NotificationController.error(title, error.message);
         }else{
            NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
         }
      });
    },

    _destroy: function(payload, options){
      var volume = payload.volume;
      var project = payload.project;

      // todo: change volume state to show that it's being destroyed
      var volumeState = new VolumeState({status_raw: "deleting"});
      volume.set({state: volumeState});
      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

      volume.destroy().done(function () {
        //NotificationController.success(null, 'Volume destroyed');

        Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});

        // todo: the proper thing to do is to poll until the volume is actually destroyed
        // and THEN remove it from the project. Need to add a callback to support that.
        // VolumeStore.pollUntilFinalState(volume);
        ProjectVolumeActions.removeVolumeFromProject(volume, project);

      }).fail(function (response) {
        var title = "Error deleting Volume " + volume.get('name');
        if(response && response.responseJSON && response.responseJSON.errors){
            var errors = response.responseJSON.errors;
            var error = errors[0];
            NotificationController.error(title, error.message);
         }else{
            NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
         }
      });
    },

    destroy: function(payload, options){
      var volume = payload.volume,
          redirectUrl = payload.redirectUrl,
          instanceUUID = volume.get('attach_data').instance_id,
          isAttached = !!instanceUUID,
          modal,
          that = this;

      if(isAttached){
        modal = ExplainVolumeDeleteConditionsModal({
          volume: volume,
          instance: stores.InstanceStore.getAll().findWhere({uuid: instanceUUID})
        });
      }else{
        modal = VolumeDeleteModal({
          volume: volume
        });
      }

      ModalHelpers.renderModal(modal, function () {
        if(isAttached) return;
        that._destroy(payload, options);
        if(redirectUrl) Backbone.history.navigate(redirectUrl, {trigger: true});
      })
    },

    destroy_noModal: function(payload, options){
      this._destroy(payload, options);
    },

    createAndAddToProject: function(payload){
      var project = payload.project;

      var modal = VolumeCreateModal();

      ModalHelpers.renderModal(modal, function (volumeName, volumeSize, identity) {
        var volume = new Volume({
          identity: {
            id: identity.id,
            provider: identity.get('provider').id
          },
          name: volumeName,
          description: "",
          size: volumeSize,
          status: "creating"
        }, {parse: true});

        var params = {
          model_name: "volume",
          tags: "CF++"
        };

        Utils.dispatch(VolumeConstants.ADD_VOLUME, {volume: volume});
        Utils.dispatch(ProjectVolumeConstants.ADD_PENDING_VOLUME_TO_PROJECT, {
          volume: volume,
          project: project
        });

        volume.save(params).done(function () {
          //NotificationController.success(null, 'Volume created');
          Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
          Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
          Utils.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
            volume: volume,
            project: project
          });
          ProjectVolumeActions.addVolumeToProject(volume, project);
          //pollUntilBuildIsFinished(volume);
        }).fail(function (response) {
          var title = "Error creating Volume " + volume.get('name');
          if(response && response.responseJSON && response.responseJSON.errors){
              var errors = response.responseJSON.errors;
              var error = errors[0];
              NotificationController.error(title, error.message);
           }else{
              NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
           }

          Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});
          Utils.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
            volume: volume,
            project: project
          });
        });
      })

    },

    reportVolume: function(volume){
      var modal = VolumeReportModal({
        volume: volume
      });

      ModalHelpers.renderModal(modal, function (reportInfo) {
        var profile = stores.ProfileStore.get(),
            username = profile.get('username'),
            reportUrl = globals.API_ROOT + "/email/support" + globals.slash(),
            problemText = "",
            reportData = {};

        if(reportInfo.problems){
          _.each(reportInfo.problems, function(problem){
            problemText = problemText + "  -" + problem + "\n";
          })
        }

        reportData = {
          username: username,
          message: "Volume ID: " + volume.id + "\n" +
                   "Provider ID: " + volume.get('identity').provider + "\n" +
                   "\n" +
                   "Problems" + "\n" +
                   problemText + "\n" +
                   "Details \n" +
                   reportInfo.details + "\n",
          subject: "Atmosphere Volume Report from " + username
        };

        $.ajax({
          url: reportUrl,
          type: 'POST',
          data: JSON.stringify(reportData),
          dataType: 'json',
          contentType: 'application/json',
          success: function (model) {
            NotificationController.info(null, "Your volume report has been sent to support.");
          },
          error: function (response, status, error) {
            NotificationController.error(null, "Your volume report could not be sent to support");
          }
        });
      })
    },

    poll: require('./volume/poll').poll

  };

});
